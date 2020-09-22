import { IUsers } from "../interface";
declare const UserController: {
    GetUser: (user: IUsers) => Promise<FirebaseFirestore.DocumentData | undefined>;
};
export default UserController;
