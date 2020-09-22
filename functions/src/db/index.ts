import admin from 'firebase-admin'
import * as cert from '../../credential.json'
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: cert.project_id,
    clientEmail: cert.client_email,
    privateKey: cert.private_key
  }),
  databaseURL: "https://peachii-bot-733fa.firebaseio.com"
});

const db = admin.firestore();
export default db