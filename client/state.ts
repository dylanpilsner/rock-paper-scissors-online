export { state };

const state = {
  data: {
    gameState: {
      playerId: "",
      choice: "",
      name: "",
      online: false,
      start: false,
      score: 0,
    },
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    const currentState = this.getState();
    currentState.gameState = newState;
  },

  pushName(name) {
    const currentGameState = this.getState().gameState;
    currentGameState.name = name;
    this.setState(currentGameState);
  },
};
