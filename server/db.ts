import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
// const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://apx-dwf-m6-23482-default-rtdb.firebaseio.com",
});
// admin.initializeApp({
//   credential: serviceAccount as any,
//   databaseURL: "https://apx-dwf-m6-23482-default-rtdb.firebaseio.com",
// });

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
