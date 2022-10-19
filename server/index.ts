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

app.post("/new-room", (req, res) => {
  const { gameState } = req.body;
  const roomRef = rtdb.ref("rooms/" + nanoid());
  roomRef.set(gameState).then(() => {
    const roomLongId = roomRef.key;
    const roomId = 1000 + Math.floor(Math.random() * 999);
    roomCollection
      .doc(roomId.toString())
      .set({ roomLongId })
      .then(() => {
        res.json({
          id: roomId.toString(),
          longId: roomLongId,
        });
      });
  });
});

app.post("/auth", (req, res) => {
  const { name } = req.body;
  userCollection
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection.add({ name }).then((newUserRef) => {
          res.json({ id: newUserRef.id });
        });
      } else {
        res.json({ id: searchResponse.docs[0].id });
      }
    });
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
