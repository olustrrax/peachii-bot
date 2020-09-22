import { IUsers } from "../interface";
declare const ContextController: {
    CheckContext: (user: IUsers) => Promise<void>;
    CreateContext: (user: IUsers) => Promise<void>;
};
export default ContextController;
