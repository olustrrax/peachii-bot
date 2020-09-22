import db from "./index"
import { IUsers } from "../interface";
import { listContext, createContext } from "../dialogflow"
const ContextController = {
  CheckContext: async (user:IUsers) => {
    let contextsLoadedTimestamp = {};
    const userId = user.uid
    const contexts = await db.collection('contexts').doc(userId);
    if (!contextsLoadedTimestamp[userId] || contextsLoadedTimestamp[userId].getTime() < new Date().getTime() - 1000 * 60 * 60) {
      //Create context in Dialogflow one-by-one
      contexts.listCollections().then(collections => {
        console.log('collections:',collections)
        collections.forEach(async context => {
          console.log('context:',context)
          await createContext(user, context)
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
      
      
      //Remember when the contexs is loaded from the firebase.
      contextsLoadedTimestamp[userId] = new Date();
  
    }
  },
  CreateContext: async (user:IUsers) => {
    const userId = user.uid
    let newContext = await db.collection('contexts').doc(userId);
    //Get the contexts from dialogflow
    let contexts = await listContext(user);
    console.log('context:',contexts)

    contexts.map((x) => {
      newContext.set({"name": x.name, "lifespanCount": x.lifespanCount})
    });
  }
}

export default ContextController
