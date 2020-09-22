import { MessageEvent, Client } from '@line/bot-sdk';
import { IUsers } from "../interface";
declare const HandleMessage: (event: MessageEvent, client: Client, user: IUsers) => Promise<void | import("@line/bot-sdk").MessageAPIResponseBase>;
export default HandleMessage;
