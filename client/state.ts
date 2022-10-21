export { state };

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
      score: 0,
      publicId: "",
      privateId: "",
    },
  },

  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState) {
    const currentState = this.getState();
    currentState.gameState = newState;
    for (let cb of this.listeners) {
      cb(newState);
    }
    // console.log("Soy el state, he cambiado: ");
    // console.log(currentState);
  },

  // setName(name) {
  //   const currentGameState = this.getState().gameState;
  //   currentGameState.name = name;
  //   this.setState(currentGameState);
  // },

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
    this.setState(currentState.gameState);
    // const currentState = this.getState();
    // fetch(API_BASE_URL + "/new-room", {
    //   method: "post",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify(currentState),
    // }).then((res) => {
    //   res.json().then((data) => {
    //     currentState.gameState.publicId = data.id;
    //     currentState.gameState.privateId = data.longId;
    //     this.setState(currentState.gameState);
    //   });
    // });
  },

  subscribe(callback: any) {
    this.listeners.push(callback);
  },

  // async test() {
  //   const currentState = this.getState().gameState;
  //   const res = await fetch(API_BASE_URL + "/auth", {
  //     method: "post",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(currentState).toLowerCase(),
  //   });

  //   const resolve = await res.json();
  //   console.log(resolve);
  // },
};
