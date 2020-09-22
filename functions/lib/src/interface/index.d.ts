export interface ILine {
    channelAccessToken: string;
    channelSecret: string;
    notifyToken: string;
}
export interface IDialogflowConfig {
    projectId: string;
    languageCode: string;
}
export interface IReqDialogflow {
    queryParams?: {
        contexts: any;
    } | any;
    queryInput: IQueryEvent | IQueryText;
    session: string;
}
export interface IQueryEvent {
    event: {
        name: string;
        languageCode: string | "th";
    };
}
export interface IQueryText {
    text: {
        text: string;
        languageCode: string | "th";
    };
}
export interface IUsers {
    uid: string;
    name: string;
    picture: string;
    language: string;
    platform: string;
}
export interface IConv {
    user: IUsers;
    parameters: any;
    intentName: string;
    response: string;
}
