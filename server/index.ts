import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as lodash from "lodash";

import * as express from "express";
import * as path from "path";
const app = express();
// const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 3000;
app.use(express.json());

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

app.post("/new-room", async (req, res) => {
  const { name, userId } = req.body;
  const roomRef = rtdb.ref("rooms/" + nanoid());

  await roomRef.set({
    player1: {
      name,
      userId,
      privateId: "",
      publicId: "",
      choice: "",
      opponentName: "",
      opponentScore: 0,
      player: 1,
      online: true,
      start: false,
      yourScore: 0,
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
    res.json({ userId: nameDoc.docs[0].id, name });
  }
});

app.get("/room-information/:publicId", async (req, res) => {
  const { publicId } = req.params;
  const roomDoc = roomCollection.doc(publicId);
  const roomInformation = await roomDoc.get();
  if (!roomInformation.data()) {
    res.json({ message: "Este room no existe" });
  } else {
    res.json({ privateId: roomInformation.data().privateId });
  }
});

app.post("/set-opponent-information/:privateId", async (req, res) => {
  const { privateId } = req.params;
  const { player } = req.body;

  const roomRef = rtdb.ref(`rooms/${privateId}`);
  const roomInformation = await (await roomRef.get()).val();
  const roomInformationArray = lodash.map(roomInformation);
  const validateOpponent = () => {
    return roomInformationArray.filter((i) => {
      return i.player != player;
    });
  };

  await roomRef.child(`player${player}`).update({
    opponentName: validateOpponent()[0].name,
    opponentScore: validateOpponent()[0].yourScore,
  });

  // console.log(validateOpponent()[0].name);

  res.json(validateOpponent());
});

app.post("/disconnect-player/:privateId", async (req, res) => {
  const { privateId } = req.params;
  const { userId } = req.query;
  const roomRef = rtdb.ref(`rooms/${privateId}`);
  const roomRefData = await (await roomRef.get()).val();
  const roomRefArray = lodash.map(roomRefData);
  const validateUser = () => {
    return roomRefArray.filter((i) => {
      return i.userId.includes(userId);
    });
  };
  await roomRef
    .child(`player${validateUser()[0].player}`)
    .update({ online: false });
  res.json({ message: "usuario desconectado con éxito" });
});

app.post("/join-game/:privateId", async (req, res) => {
  const { privateId } = req.params;
  const { gameState } = req.body;
  const roomRef = rtdb.ref(`rooms/${privateId}`);

  const roomRefData = await (await roomRef.get()).val();
  const roomRefArray = lodash.map(roomRefData);
  const validateUser = () => {
    return roomRefArray.filter((i) => {
      return i.userId.includes(gameState.userId);
    });
  };
  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  if (roomRefArray.length == 1 && validateUser() == "") {
    const player2 = await roomRef.update({
      player2: gameState,
    });
    // if ((await await (await roomRef.get()).val()["player2"].player) == 0) {
    await roomRef.child("player2").update({ player: 2 });
    await roomRef.child("player2").update({ online: true });
    // }

    res.json([await (await roomRef.get()).val()["player2"]]);
  }
  if (roomRefArray.length == 2 && validateUser() == "") {
    res.json({ message: "sala llena" });
  }

  if (validateUser() != "") {
    res.json(validateUser());
    await roomRef
      .child(`player${validateUser()[0].player}`)
      .update({ online: true });
  }
});

app.post("/test", (req, res) => {
  window.addEventListener("beforeunload", (e) => {
    res.json({ message: "ok" });
  });
});

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
