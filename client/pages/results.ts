import { state } from "../state";

export function initResultsPage(param) {
  const win = require("url:../assets/win.png");
  const draw = require("url:../assets/draw.svg");
  const lose = require("url:../assets/lose.png");
  const div = document.createElement("div");
  const style = document.createElement("style");
  const result = state.getState().result;
  window.addEventListener("load", async () => {
    await state.listenDatabase();
    await state.connectPlayer();
  });

  div.classList.add("main-container");

  style.innerHTML =
    /*css*/
    `
  .main-container {
    height: 100vh;
    max-width:335px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin:0 auto;
  }
  .opponent-move-container {
    transform: rotate(180deg);
  }
  
  .my-move-container {
    align-items: flex-end;
  }
  
  .result-container {
    position: absolute;
    top:0;
    left: 50%;
    margin-left: -167.5px;
    height: 100vh;
    width: 100%;
    align-self:center;
    max-width: 335px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0%;
    flex-direction: column;
    animation-duration: 3s;
    animation-name: showsup;
    animation-delay: 0.5s;
    animation-fill-mode: forwards;
  }
  
  .result-container.draw {
    background-color: #828282b0;
  }
  .result-container.win {
    background-color: #6cb46cb0;
  }
  .result-container.lose {
    background-color: #894949e5;
  }
  
  @keyframes showsup {
    50%,
    100% {
      opacity: 100%;
    }
  }
  
  .result {
    height: 250px;
  }
  
  .score-container {
    height: 217px;
    width: 260px;
    background-color: white;
    border: solid 10px;
    border-radius: 10px;
    margin-top: 40px;
  }
  .score-title {
    font-size: 55px;
    margin: 0;
    text-align: center;
    margin-bottom: 10px;
  }
  .vos,
  .bot {
    font-size: 35px;
    margin: 0;
    text-align: right;
    margin-right: 60px;
  }
  
  .score {
    margin-left: 10px;
  }
  
  .play-again-button {
    width: 100%;
    margin-top: 30px;
    text-align:center;
  }
  `;

  function chooseImage() {
    if (result == "win") {
      return win;
    } else if (result == "lose") {
      return lose;
    } else if (result == "draw") {
      return draw;
    }
  }

  const gameState = state.getState().gameState;
  div.innerHTML =
    /*html*/
    `
  <div class="opponent-move-container">
  <the-move  state="final-choice" move="${
    gameState.opponentChoice
  }"  style="text-align:center;"></the-move>
  </div>
  <div class="my-move-container">
  <the-move state="final-choice" move=${
    gameState.choice
  }  style="text-align:center;"></the-move>
  </div>
  <div class="result-container">
  <img class="result" src="${chooseImage()}" />
  <div class="score-container">
  <h3 class="score-title">Score</h3>
  <h4 class="vos">${gameState.name}:<span class="score">${
      gameState.yourScore
    }</span></h4>
  <h4 class="bot">${gameState.opponentName}:<span class="score">${
      gameState.opponentScore
    }</span></h4>
  </div>
  <div class="play-again-button">
  <my-button>Volver a Jugar</my-button>
  </div>
  </div>
`;

  function declaresResult() {
    const resultContainer = div.querySelector(".result-container")!;
    if (result == "win") {
      resultContainer.classList.add("win");
    } else if (result == "draw") {
      resultContainer.classList.add("draw");
    } else if (result == "lose") {
      resultContainer.classList.add("lose");
    }
  }
  declaresResult();

  const button = div.querySelector("my-button")!;
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    await state.setChoice("", true);
    param.goTo("/waiting-room");
  });

  div.appendChild(style);
  return div;
}
