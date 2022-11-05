export { state };
import { rtdb } from "./rtdb";
import { onValue, ref, off } from "firebase/database";
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
    redirect: false,
  },

  listeners: [],

  init() {
    const { gameState } = this.getState();
    const state = JSON.parse(localStorage.getItem("saved-state")!);
    if (state) {
      this.setState(state);
    }
  },

  async refresh(param) {
    await this.listenDatabase();
    await this.connectPlayer();
    await this.redirect(param);
  },

  async resetData() {
    const currentState = this.getState();
    const { gameState } = this.getState();
    currentState.result = "";
    state.setState(currentState);
    await this.setChocie("", true);
    await this.setPLayerStatus(false);
    await this.disconnectPlayer();
  },

  async listenDatabase() {
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
    });
  },

  async declaresAWinner() {
    const { gameState } = this.getState();
    const myChoice = gameState.choice;
    const opponentChoice = gameState.opponentChoice;
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

  async listenPlay() {
    const currentState = this.getState();
    const result = await this.declaresAWinner();
    currentState.result = result;
    this.setState(currentState);
  },

  async updateScore() {
    const currentState = this.getState();
    const gameState = this.getState().gameState;
    if (currentState.result == "win") {
      const res = await fetch(
        `${API_BASE_URL}/update-score/${gameState.privateId}`,
        {
          method: "put",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            yourScore: gameState.yourScore,
            player: gameState.player,
          }),
        }
      );
    }
  },

  async setChoice(choice: string, reset?: boolean) {
    const { gameState } = this.getState();
    if (gameState.choice == "" || reset == true) {
      const res = fetch(`${API_BASE_URL}/set-choice/${gameState.privateId}`, {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ player: gameState.player, choice }),
      });
    }
  },

  async redirect(callback, turnOff?) {
    const gameState = this.getState().gameState;
    const currentState = this.getState();
    const roomPlayers = ref(rtdb, `rooms/${gameState.privateId}`);
    const opponentPlayer = gameState.player == 1 ? 2 : 1;

    onValue(roomPlayers, async (snapshot) => {
      const data = await snapshot.val();

      if (
        data.player1.online === true &&
        data.player2.online === true &&
        data.player1.start === false &&
        data.player2.start === false
      ) {
        callback("/waiting-room");
      }
      if (
        data.player1.online === true &&
        data.player2.online === true &&
        data[`player${gameState.player}`].start === true &&
        data[`player${opponentPlayer}`].start === false
      ) {
        callback("/waiting-opponent");
      }
      if (
        data.player1.online === true &&
        data.player2.online === true &&
        data[`player${gameState.player}`].start === false &&
        data[`player${opponentPlayer}`].start === true
      ) {
        callback("/waiting-room");
      }

      if (
        data.player1.online === true &&
        data.player2.online === true &&
        data[`player${gameState.player}`].start === true &&
        data[`player${opponentPlayer}`].start === true
      ) {
        callback("/play");
      }
      currentState.redirect = true;
      this.setState(currentState);
    });

    if (turnOff === "off") {
      off(roomPlayers, "value");
    }
  },

  setRedirectStatus(status) {
    const currentState = this.getState();
    currentState.redirect = status;
    this.setState(currentState);
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (let cb of this.listeners) {
      cb(newState);
    }

    localStorage.setItem("saved-state", JSON.stringify(newState));
  },

  async setNameAndCreateOrGetUserId(name: string) {
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
  async connectPlayer() {
    const gameState = this.getState().gameState;
    const res = await fetch(
      `${API_BASE_URL}/connect-player/${gameState.privateId}?userId=${gameState.userId}`,
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
