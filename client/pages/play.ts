import { state } from "../state";

export function initPlayPage(param) {
  let counter: any = 2;
  const div = document.createElement("div");
  const style = document.createElement("style");
  const { gameState } = state.getState();

  div.classList.add("main-container");

  style.innerHTML =
    /*css*/
    `
  .main-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  
  .countdown-container {
    font-family: "Oswald";
    font-size: 100px;
    margin:0;
    height:100%;
    display:flex;
    align-items:center;
  }
  
  @media (min-width: 769px) {
    .countdown-container {
      font-size: 200px;
    }
  }
  
  .moves-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
    gap: 10px;
  }
  
  @media (min-width: 769px) {
    .moves-container {
      gap: 45px;
    }
  }
    .chosen{
      transition:0.5s ease all;
      transform:translateY(-30px);
    }

    .not-chosen{
      transition:0.5s ease all;
      opacity:50%;
    }
  
  `;

  div.innerHTML =
    /*html*/
    `
  <div class="countdown-container">
  <div class="countdown">3</div>
  </div>
  <my-button class="test">Test</my-button>
  <div class="moves-container">
  <the-move state="play" move="piedra" class="piedra"></the-move>
  <the-move state="play" move="papel" class="papel"></the-move>
  <the-move state="play" move="tijera" class="tijera"></the-move>
  </div>
  `;

  const choice = div.querySelectorAll("the-move");
  choice.forEach(async (i) => {
    i.addEventListener("click", async function connectedCallback(e) {
      const target = e.target as any;
      const move = target.getAttribute("move");
      // state.setMove(move, randomMove);
      // state.winner();
      const piedra = div.querySelector(".piedra")!;
      const papel = div.querySelector(".papel")!;
      const tijera = div.querySelector(".tijera")!;
      if (move == "piedra") {
        piedra.classList.add("chosen");
        papel.classList.add("not-chosen");
        tijera.classList.add("not-chosen");
      } else if (move == "papel") {
        papel.classList.add("chosen");
        piedra.classList.add("not-chosen");
        tijera.classList.add("not-chosen");
      } else if (move == "tijera") {
        tijera.classList.add("chosen");
        piedra.classList.add("not-chosen");
        papel.classList.add("not-chosen");
      }
      // await state.listenPlay(move, test);
    });
  });
  choice.forEach((i) => {
    i.addEventListener("click", (e) => {
      const target = e.target as any;
      const move = target.getAttribute("move");
    });
  });

  const intervalId = setInterval(async () => {
    const countdownContainer: any = div.querySelector(".countdown-container");
    const currentGame = state.getState().currentGame;
    countdownContainer.innerHTML = counter;
    counter--;
    if (counter < 0) {
      clearInterval(intervalId);
      countdownContainer.style.display = "none";
      const test = div.querySelector(".chosen");
      const test2 = test?.getAttribute("move");
      await state.listenPlay(test2);
      if (gameState.choice == "" || gameState.opponentChoice == "") {
        await state.setChoice("");
        await state.setPLayerStatus(false);
        await state.listenPlay(test2, "test");
        param.goTo("/waiting-room");
      }
      // if (currentGame.myPlay == "") {
      //   param.goTo("/instructions");
      // } else param.goTo("/results");
    }
  }, 1000);

  // if (currentGame.myPlay == "") {
  //   param.goTo("/instructions");
  // }

  div.appendChild(style);

  return div;
}
