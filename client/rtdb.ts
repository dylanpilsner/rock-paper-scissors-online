import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: "https://apx-dwf-m6-23482-default-rtdb.firebaseio.com",
  projectId: "apx-dwf-m6-23482",
  authDomain: "apx-dwf-m6-23482.firebase.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const rtdb = getDatabase();

export { rtdb };
