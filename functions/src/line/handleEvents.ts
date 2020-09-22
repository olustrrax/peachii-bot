import * as Config from "../setting"
import { get } from 'lodash';
// import { EventBase, MessageEvent, FollowEvent, UnfollowEvent, JoinEvent, LeaveEvent, PostbackEvent, BeaconEvent, EventMessage, Client } from "@line/bot-sdk";
import { EventBase, FollowEvent, Client, MessageEvent, UnfollowEvent } from "@line/bot-sdk";
import HandleMessage from "./handleMessage"
import UserController from "../db/user";
import { IUsers } from "../interface";

const client = new Client(Config.CONFIG_LINE);

export const setCustomerLine = (profile:any)=> {
  const user:IUsers = {
    name: profile.displayName,
    picture: profile.pictureUrl,
    language: profile.language,
    uid: profile.userId,
    platform: 'LINE'
  }
  return user;
}
const HandleEvents = async (req:any, res:any, events:EventBase) => {
  /* Find customer with userId */
	const userId = get(events, ['source', 'userId']) || ""
  const profile = await client.getProfile(userId)
  const user = await UserController.GetUser({ ...setCustomerLine(profile) })
  /* Check Event Type */
  const eventType = get(events, 'type');
  switch (eventType) {
    case 'message':
      return HandleMessage(events as MessageEvent, client, user  as IUsers)

    case 'follow':
      return handleFollow(events as FollowEvent, user as IUsers);

    case 'unfollow':
      return handleUnfollow(events as UnfollowEvent, res);

    // case 'join':
    //   return handleJoin(events as JoinEvent);

    // case 'leave':
    //   return handleLeave(events as LeaveEvent, res);

    // case 'postback':
    //   return handlePostback(events as PostbackEvent);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(events)}`);
  }
}
const handleFollow = async (event: FollowEvent, user:IUsers) => {
  /* Send response to client */
  const replyToken = get(event, 'replyToken');
  return client.replyMessage(replyToken, {type: "text" , text: `สวัสดีคุณ ${user.name} ขอบคุณที่เพิ่มน้องพีชชี่เป็นเพื่อน 🥰`})
  
}

const handleUnfollow = (event: UnfollowEvent, res) => {
  return res.sendStatus(200)
}

// const handleJoin = (event: JoinEvent) => {
//   return 
// }

// const handleLeave = (event: LeaveEvent, res) => {
//   return 
// }

// const handlePostback = (event: PostbackEvent) => {
//   return 
// }

export default HandleEvents