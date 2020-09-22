import { IUsers } from "./interface";
export declare const ReponseDialogflow: (text: string, user: IUsers, params?: {}) => Promise<{
    response: any;
    intent: any;
}>;
export declare const createContext: (user: IUsers, Acontext: any) => any;
export declare const listContext: (user: IUsers) => any;
export declare const EventDialogflow: (text: string, user: IUsers) => Promise<any>;
