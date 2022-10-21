import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";

import * as express from "express";
import * as path from "path";
const app = express();
// const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 3000;
app.use(express.json());

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

app.post("/new-room", async (req, res) => {
  const { gameState, name, userId } = req.body;
  const roomRef = rtdb.ref("rooms/" + nanoid());
  await roomRef.set({
    player1: {
      name,
      userId,
      privateId: "",
      publicId: "",
      choice: "",
      online: true,
      start: false,
      score: 0,
    },
  });
  const privateId = roomRef.key;
  const publicId = 1000 + Math.floor(Math.random() * 999);
  await roomRef.child("player1/").update({ publicId, privateId });
  const newRoomDoc = roomCollection.doc(publicId.toString());
  await newRoomDoc.set({ privateId, publicId });
  const response = res.json({ publicId, privateId });
});

app.post("/auth", async (req, res) => {
  const { name } = req.body;
  const nameDoc = await userCollection.where("name", "==", name).get();
  if (nameDoc.empty) {
    const newUserDoc = await userCollection.add({ name });
    res.json({ userId: newUserDoc.id, name });
  } else {
    res.json({ userId: nameDoc.docs[0].id });
  }
});

// app.get("/test", (req, res) => {
//   res.json("testeando API");
// });

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
