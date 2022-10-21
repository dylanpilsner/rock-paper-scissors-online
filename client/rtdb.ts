import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "0Yb0WnW3LORie8jPXv5nKqw37vFB1nXLBmJZam0I",
  databaseURL: "https://apx-dwf-m6-23482-default-rtdb.firebaseio.com",
  projectId: "apx-dwf-m6-23482",
  authDomain: "apx-dwf-m6-23482.firebase.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const rtdb = getDatabase();

export { rtdb };
