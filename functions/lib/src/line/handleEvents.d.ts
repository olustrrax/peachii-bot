import { EventBase } from "@line/bot-sdk";
import { IUsers } from "../interface";
export declare const setCustomerLine: (profile: any) => IUsers;
declare const HandleEvents: (req: any, res: any, events: EventBase) => Promise<any>;
export default HandleEvents;
