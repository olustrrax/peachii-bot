import dotenv from "dotenv"
import { ILine, IDialogflowConfig } from "../interface"
dotenv.config()

export const MONGO_URL: string = process.env.MONGO_URL || ""
export const PROJECT_NAME: string = process.env.PROJECT_NAME || ""
export const PORT: string = process.env.PORT || ""
export const CONFIG_LINE: ILine = {
  channelAccessToken: process.env.ACCESS_TOKEN || "",
  channelSecret: process.env.CHANNEL_SECRET || "",
  notifyToken: process.env.NOTIFY_TOKEN || ""
}
export const LANGUAGE_CODE: string = process.env.LANGUAGE_CODE || ""
export const LINE_USERID:string = process.env.LINE_USERID || ""
export const GOOGLE_APP_CREDENTIALS = process.env.GOOGLE_APP_CREDENTIALS || ""
export const DIALOGFLOW: IDialogflowConfig = {
  projectId: process.env.PROJECT_ID || "",
  languageCode: LANGUAGE_CODE || ""
}

