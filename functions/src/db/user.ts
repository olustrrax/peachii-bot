import db from "./index"
import { IUsers } from "../interface";
const UserController = {
  GetUser: async (user:IUsers) => {
    const userId = user.uid
    const userRef = await db.collection('users').doc(userId);
    return userRef.get().then( async(doc) => {
      if (doc.exists) {
        return doc.data();
      }
      else {
        await db.collection('users').doc(userId).set(user)
        return user
      }
    })
    
  }
}

export default UserController
