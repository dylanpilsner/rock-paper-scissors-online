export { state };
import { rtdb } from "./rtdb";
import { getDatabase, onValue, ref, off } from "firebase/database";
import test from "node:test";
export const API_BASE_URL =
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
      opponentName: "",
      opponentScore: 0,
      opponentChoice: "",
      player: 0,
    },
    result: "",
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
      this.setState(currentState);
    });
  },

  async setOpponentInformation() {
    const gameState = this.getState().gameState;
    const room = ref(rtdb, `rooms/${gameState.privateId}`);

    onValue(room, async (snapshot) => {
      const data = await snapshot.val();
      const res = await fetch(
        `${API_BASE_URL}/set-opponent-information/${gameState.privateId}`,
        {
          method: "put",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(gameState),
        }
      );
      // const opponentData = await res.json();
    });
  },

  declaresAWinner(opponentChoice) {
    const { gameState } = this.getState();
    const myChoice = gameState.choice;
    if (myChoice == "piedra" && opponentChoice == "papel") {
      return "lose";
    }
    if (myChoice == "piedra" && opponentChoice == "tijera") {
      return "win";
    }
    if (myChoice == "piedra" && opponentChoice == "piedra") {
      return "draw";
    }
    if (myChoice == "papel" && opponentChoice == "papel") {
      return "draw";
    }
    if (myChoice == "papel" && opponentChoice == "tijera") {
      return "lose";
    }
    if (myChoice == "papel" && opponentChoice == "piedra") {
      return "win";
    }
    if (myChoice == "tijera" && opponentChoice == "papel") {
      return "win";
    }
    if (myChoice == "tijera" && opponentChoice == "tijera") {
      return "draw";
    }
    if (myChoice == "tijera" && opponentChoice == "piedra") {
      return "lose";
    }
  },

  async listenPlay(choice, tat?) {
    const currentState = this.getState();
    const gameState = this.getState().gameState;
    // gameState.choice = choice;
    // this.setState(currentState);
    const room = ref(rtdb, `rooms/${gameState.privateId}`);
    const opponentPLayer = gameState.player == 1 ? 2 : 1;

    onValue(room, async (snapshot) => {
      const data = await snapshot.val();

      if (gameState.choice == "") {
        const res = await fetch(
          `${API_BASE_URL}/set-choice/${gameState.privateId}`,
          {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ player: gameState.player, choice }),
          }
        );
        const result = await this.declaresAWinner(
          await data[`player${opponentPLayer}`].choice
        );
        currentState.result = result;
        this.setState(currentState);
      }
    });
    if (tat == "test") {
      off(room);
    }
  },
  async setChoice(choice) {
    const { gameState } = this.getState();
    const res = await fetch(
      `${API_BASE_URL}/set-choice/${gameState.privateId}`,
      {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ player: gameState.player, choice }),
      }
    );

    const data = await res.json();
    // console.log(data);
  },

  async redirectToWaitingRoom(callback) {
    const gameState = this.getState().gameState;
    const roomPlayers = ref(rtdb, `rooms/${gameState.privateId}`);
    onValue(roomPlayers, async (snapshot) => {
      const data = await snapshot.val();
      if (data.player1.online === true && data.player2.online === true) {
        callback("/waiting-room");
      }
    });
  },
  async listenStatusAndRedirect(callback: (param) => {}) {
    const gameState = this.getState().gameState;
    const opponentPlayer = gameState.player == 1 ? 2 : 1;
    const roomPlayers = ref(rtdb, `rooms/${gameState.privateId}`);
    onValue(roomPlayers, async (snapshot) => {
      const data = await snapshot.val();
      console.log(data);

      if (
        data[`player${opponentPlayer}`].start === false &&
        data[`player${gameState.player}`].start === true
      ) {
        callback("/waiting-opponent");
      }
      if (
        data[`player${opponentPlayer}`].start === true &&
        data[`player${gameState.player}`].start === true
      ) {
        callback("/play");
      }
    });
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (let cb of this.listeners) {
      cb(newState);
    }
    console.log("Soy el state, he cambiado: ");
    console.log(newState);
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

    this.setState(currentState);
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
    this.setState(currentState);
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
      this.setState(currentState);
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
    this.setState(currentState);
    console.log(data);

    return data;
  },

  async disconnectPlayer() {
    const gameState = this.getState().gameState;
    const res = await fetch(
      `${API_BASE_URL}/disconnect-player/${gameState.privateId}?userId=${gameState.userId}`,
      {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  },

  async setPLayerStatus(status) {
    const { gameState } = this.getState();
    const res = await fetch(
      `${API_BASE_URL}/set-player-status/${gameState.privateId}`,
      {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, player: gameState.player }),
      }
    );
  },

  subscribe(callback: any) {
    this.listeners.push(callback);
  },
};
