import { get } from 'lodash';
import { MessageEvent, EventMessage, Client } from '@line/bot-sdk';
import { ReponseDialogflow } from "../dialogflow"
import { IUsers } from "../interface"
import { AirThai } from "air-thai-api"
import ContextController from '../db/context';

const HandleMessage = async (event: MessageEvent, client:Client, user: IUsers) => {
  const message: EventMessage = get(event, 'message');

  /* Check Message Type */
  const messageType = get(message, 'type');
  switch (messageType) {
    case 'text':
      return handleText(event, client, user);
    // case 'image':
    //   return handleImage(event as MessageEvent, client as Client, user as IUsers);
    // case 'video':
    //   return handleVideo(event as MessageEvent, client as Client, user as IUsers);
    // case 'audio':
    //   return handleAudio(event as MessageEvent, client as Client, user as IUsers);
    case 'location':
      return handleLocation(event, client, user);
    // case 'sticker':
    //   return handleSticker(event as MessageEvent, client as Client, user as IUsers);
    default:
      throw new Error(`Unknown message: ${JSON.stringify(message)}`);
  }
}


const handleText = async (event: MessageEvent, client:Client, user: IUsers) => {
  const replyToken = get(event, 'replyToken');
  const text = get(event, ['message', 'text']) || get(event, ['message'])
  /** Check context */
  await ContextController.CheckContext(user)
  const { response } = await ReponseDialogflow(text, user)
  return client.replyMessage(replyToken, response).then(() => {
    /*Save current context*/
    ContextController.CreateContext(user)
  })
}



const handleLocation =  async (event: MessageEvent, client:Client, user: IUsers) => {
  const replyToken = get(event, 'replyToken');
  const latitude = get(event, ['message', 'latitude']);
  const longitude = get(event, ['message', 'longitude']);
  
  const result = await AirThai({ lat: latitude, long: longitude })
  console.log('result:',result)
  return client.replyMessage(replyToken, [{ "type": "text", "text": "yo" }])
}


export default HandleMessage