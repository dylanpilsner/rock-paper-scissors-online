export { state };
import { rtdb } from "./rtdb";
import { getDatabase, onValue, ref } from "firebase/database";

const API_BASE_URL =
  process.env.NODE_ENV == "production"
    ? "https://dp-rock-paper-scissors.herokuapp.com"
    : "http://localhost:3000";

const state = {
  data: {
    gameState: {
      userId: "",
      choice: "",
      name: "",
      online: false,
      start: false,
      yourScore: 0,
      publicId: "",
      privateId: "",
      oponentName: "",
      oponentScore: 0,
      player: 0,
    },
  },

  listeners: [],

  async listenDataBase() {
    const currentState = this.getState();
    const gameState = this.getState().gameState;
    const room = ref(
      rtdb,
      `rooms/${gameState.privateId}/player${gameState.player}`
    );
    onValue(room, async (snapshot) => {
      const data = await snapshot.val();
      // currentState.gameState = data
      // this.setState(currentState.gameState);
      console.log(data);
    });

    const roomPlayers = ref(rtdb, `rooms/${gameState.privateId}`);
    onValue(roomPlayers, async (snapshot) => {
      const data = await snapshot.val();
      console.log(data);
    });
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    const currentState = this.getState();
    currentState.gameState = newState;
    for (let cb of this.listeners) {
      cb(newState);
    }
    console.log("Soy el state, he cambiado: ");
    console.log(currentState);
  },

  async setNameAndCreateOrGetUserId(name) {
    const currentState = this.getState();
    const fetching = await fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }).toLowerCase(),
    });
    const res = await fetching.json();
    currentState.gameState.name = name;
    currentState.gameState.userId = res.userId;
    console.log(res);

    this.setState(currentState.gameState);
  },

  async createNewRoom() {
    const currentState = this.getState();
    const res = await fetch(`${API_BASE_URL}/new-room`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(currentState.gameState),
    });

    const data = await res.json();

    currentState.gameState.publicId = data.publicId;
    currentState.gameState.privateId = data.privateId;
    currentState.gameState.player = 1;
    this.setState(currentState.gameState);
  },

  async getRoomInformation(publicId) {
    const currentState = this.getState();
    const res = await fetch(`${API_BASE_URL}/room-information/${publicId}`);
    const data = await res.json();
    console.log(data);
    const error = data.message;
    if (error == "Este room no existe") {
      return "room inexistente";
    } else {
      currentState.gameState.privateId = data.privateId;
      currentState.gameState.publicId = publicId;
      this.setState(currentState.gameState);
    }
  },

  async joinGame() {
    const currentState = this.getState();

    const res = await fetch(
      `${API_BASE_URL}/join-game/${currentState.gameState.privateId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(currentState),
      }
    );
    const data = await res.json();
    if (data.message != "sala llena") {
      currentState.gameState = data[0];
      currentState.gameState.online = true;
      this.setState(currentState.gameState);
    } else {
      window.alert("Esta sala está llena, por favor crea una nueva sala.");
    }
  },

  async disconnectPlayer() {
    const gameState = this.getState().gameState;
    const res = await fetch(
      `${API_BASE_URL}/disconnect-player/${gameState.privateId}?userId=${gameState.userId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await res.json();
    console.log(data);
  },

  subscribe(callback: any) {
    this.listeners.push(callback);
  },
};
