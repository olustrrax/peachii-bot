
import dialogflow from 'dialogflow';
import * as Config from "./setting"
import { IReqDialogflow, IUsers, IConv } from "./interface"
import _, { get } from 'lodash';
import { struct } from "pb-util"
import IntentMap from "./fulfillment"

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: Config.GOOGLE_APP_CREDENTIALS
})
const contextsClient = new dialogflow.ContextsClient({
  keyFilename: Config.GOOGLE_APP_CREDENTIALS
})


export const ReponseDialogflow = async (text:string, user:IUsers, params={}) => {
  const sessionId = user.uid
  const sessionPath = await sessionClient.sessionPath(Config.DIALOGFLOW.projectId, sessionId)
  const request: IReqDialogflow = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: Config.LANGUAGE_CODE
      }
    },
    queryParams: {
      platform: "LINE"
    }
  }
  const promise = await sessionClient.detectIntent(request)
  const queryResult = get(promise, ['0', 'queryResult']);
  const fulfillmentMessage = get(queryResult, 'fulfillmentMessages');
  const intentName = get(queryResult, ['intent', 'displayName']);
  console.log('intentName:',intentName)

  const platform = user.platform
  let response = await GetPlatform(fulfillmentMessage, platform)
  const fulfillmentRes = await IntentMap.get(intentName)
  if(fulfillmentRes){
    const parameters = queryResult.parameters
    const pack:IConv = {
      user,
      parameters: struct.decode(parameters),
      intentName,
      response: JSON.stringify(response)
    }
    response = await fulfillmentRes(pack) 
  }else{
    response = JSON.stringify(response)
  }
  return { response : cleanData(JSON.parse(response)), intent: intentName }
}

export const createContext = (user: IUsers, Acontext) => {
  const sessionId = get(user, 'uid')
  const sessionPath = contextsClient.sessionPath(Config.DIALOGFLOW.projectId, sessionId);
  console.log("Acontext", Acontext);
  const request = {
    parent: sessionPath,
    context: Acontext
  }

  return contextsClient
    .createContext(request)
    .then(responses => {
      return responses[0];
    })
    .catch(err => {
      console.error('Failed to create contexts:', err);
    });
}

export const listContext = (user: IUsers,) => {
  const sessionId = get(user, 'uid')
  const sessionPath = contextsClient.sessionPath(Config.DIALOGFLOW.projectId, sessionId);
  const request = {
    parent: sessionPath
  }
  return contextsClient
    .listContexts(request)
    .then(responses => {
      return responses[0];
    })
    .catch(err => {
      console.error('Failed to list contexts:', err);
    });
}

const GetPlatform = async (fulfillmentMessage:any, platform = 'LINE') => {
  const responseLine = _.filter(fulfillmentMessage, {platform})
  if(responseLine?.length){ 
    return SetFormat(responseLine, platform);
  }
  else{
    const responseDefault = _.filter(fulfillmentMessage, {platform: "PLATFORM_UNSPECIFIED"})
    return SetFormat(responseDefault, platform)
  }
}

const SetFormat = async(data:any, platform:string) => {
  return data.map(( item:any, index:number ) => {
    if(item.message === 'payload'){
      const payload:any = struct.decode(item[item.message])
      // console.log('\n\npayload:\n',payload)
      return payload[platform.toLocaleLowerCase()]
    }
    else if(item.message === 'quickReplies'){
      const quickReplies:any = item.quickReplies
      return QuiclReplyDF(quickReplies, platform) 
    }
    else if(item.message === 'image'){
      const image:any = item.image.imageUri
      return ImageDF(image, platform) 
    }
    else{
      const text = get(item, ["text","text",0])
      if(text)
        return platform === 'LINE' ? { type: "text", text } : { text }
    }
  })
}

const ImageDF = (image: string, platform:string) => {
  switch (platform) {
    case 'LINE':
      return {
        type: "image",
        originalContentUrl: image,
        previewImageUrl: image,
        animated: false
      }
    case 'FACEBOOK':
      return {
        attachment: {
          payload: {
            is_reusable: true,
            url: image,
          },
          type: "image"
        }
      }
    default:
      return image
  }
}

const QuiclReplyDF = (quickReplies:any, platform:string) => {
  switch (platform) {
    case 'LINE':
      const items = quickReplies.quickReplies.map((e:any) => {
        return {
          type:  "action",
          action:  {
            type:  "message",
            label:  e,
            text:  e
          }
        }
      })
      const formdataLine = {
        type: "text",
        text: quickReplies.title,
        quickReply: {items}
      }
      return formdataLine
    case 'FACEBOOK':
      const quick_replies = quickReplies.quickReplies.map((e:any) => {
        return {
          content_type:  "text",
          title:  e,
          payload: e
        }
      })
      const formdataFacebook = {
        text:  quickReplies.title,
        quick_replies
      }
      return formdataFacebook
    default:
      return quickReplies;
  }
}
const cleanData = (response:any) => {
  return response.filter((e:any) => {if(e) return e})
}

export const EventDialogflow = async (text:string, user:IUsers) => {
  const sessionId = user.uid
  const sessionPath = sessionClient.sessionPath(Config.DIALOGFLOW.projectId, sessionId)
  const request: IReqDialogflow = {
    session: sessionPath,
    queryInput: {
      event: {
        name: text,
        languageCode: Config.LANGUAGE_CODE
      }
    }
  }
  const promise = await sessionClient.detectIntent(request)
  const result = get(promise, ['0', 'queryResult']);
  const fulfillmentMessage = get(result, 'fulfillmentMessages');
  const response = await GetPlatform(fulfillmentMessage)
  return cleanData(response)
}

