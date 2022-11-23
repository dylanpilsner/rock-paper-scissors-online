import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as lodash from "lodash";
import * as express from "express";
import * as path from "path";
const app = express();
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
      opponentChoice: "",
      player: 1,
      online: true,
      start: false,
      yourScore: 0,
      result: "",
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

app.put("/set-opponent-information/:privateId", async (req, res) => {
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
    opponentChoice: validateOpponent()[0].choice,
  });

  res.json(validateOpponent());
});

app.put("/disconnect-player/:privateId", async (req, res) => {
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
app.put("/connect-player/:privateId", async (req, res) => {
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
    .update({ online: true });
  res.json({ message: "usuario conectado con éxito" });
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

  if (roomRefArray.length == 1 && validateUser() == "") {
    const player2 = await roomRef.update({
      player2: gameState,
    });
    await roomRef.child("player2").update({ player: 2, online: true });

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

app.put("/set-player-status/:privateId", async (req, res) => {
  const { privateId } = req.params;
  const { status, player } = req.body;
  const roomRef = rtdb.ref(`rooms/${privateId}`);
  await roomRef.child(`player${player}`).update({ start: status });
  res.json({ message: "status cambiado con éxito" });
});

app.put("/set-choice/:privateId", async (req, res) => {
  const { privateId } = req.params;
  const { choice, player } = req.body;
  const roomRef = rtdb.ref(`rooms/${privateId}`);

  await roomRef.child(`player${player}`).update({ choice });
  res.json({ message: "selección actualizada con éxito" });
});

app.put("/update-score/:privateId", async (req, res) => {
  const { player, yourScore } = req.body;
  const { privateId } = req.params;

  const roomRef = rtdb.ref(`rooms/${privateId}`);

  await roomRef.child(`player${player}`).update({ yourScore: yourScore + 1 });
  res.json({ message: "score actualizado" });
});

const pathResolve = path.resolve("dist");

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
