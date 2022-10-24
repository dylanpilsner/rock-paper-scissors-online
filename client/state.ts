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
      currentState.gameState = data;
      this.setState(currentState.gameState);
    });
  },

  async setOponentInformation() {
    const currentState = this.getState();
    const gameState = this.getState().gameState;
    const room = ref(rtdb, `rooms/${gameState.privateId}`);

    onValue(room, async (snapshot) => {
      const data = await snapshot.val();
      const res = await fetch(
        `${API_BASE_URL}/set-opponent-information/${gameState.privateId}`,
        {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(gameState),
        }
      );
      const opponentData = await res.json();
    });
  },

  async redirectToWaitingRoom(callback) {
    const gameState = this.getState().gameState;
    const roomPlayers = ref(rtdb, `rooms/${gameState.privateId}`);
    onValue(roomPlayers, async (snapshot) => {
      const data = await snapshot.val();
      if (data.player1.online === true && data.player2.online === true) {
        callback("/waiting-room");
      }

      // if (data.player1 == true && data.player2 == true) {
      //   return true;
      // } else return false;
      // // console.(data);
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
    currentState.gameState = data[0];
    this.setState(currentState.gameState);
    console.log(data);

    return data;
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
    return data;
  },

  resetAllInformation() {
    const currentState = this.getState().gameState;
    currentState.userId = "";
    currentState.choice = "";
    currentState.name = "";
    currentState.online = false;
    currentState.start = false;
    currentState.yourScore = 0;
    currentState.publicId = "";
    currentState.start = false;
    currentState.yourScore = 0;
    currentState.publicId = "";
    currentState.privateId = "";
    currentState.oponentName = "";
    currentState.oponentScore = 0;
    currentState.player = 0;
    this.setState(currentState);
  },

  subscribe(callback: any) {
    this.listeners.push(callback);
  },
};
