import { state } from "../state";

export function initPlayPage(param) {
  let counter: any = 2;
  const div = document.createElement("div");
  const style = document.createElement("style");
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
    i.addEventListener("click", async (e) => {
      const target = e.target as any;
      const move = target.getAttribute("move");
      // state.setMove(move, randomMove);
      // state.winner();
      await state.listenPlay(move);
      const { gameState } = await state.getState();

      const piedra = div.querySelector(".piedra")!;
      const papel = div.querySelector(".papel")!;
      const tijera = div.querySelector(".tijera")!;
      if (gameState.choice == "piedra") {
        piedra.classList.add("chosen");
        papel.classList.add("not-chosen");
        tijera.classList.add("not-chosen");
      } else if (gameState.choice == "papel") {
        papel.classList.add("chosen");
        piedra.classList.add("not-chosen");
        tijera.classList.add("not-chosen");
      } else if (gameState.choice == "tijera") {
        tijera.classList.add("chosen");
        piedra.classList.add("not-chosen");
        papel.classList.add("not-chosen");
      }
    });
  });

  const intervalId = setInterval(() => {
    const countdownContainer: any = div.querySelector(".countdown-container");
    const currentGame = state.getState().currentGame;
    countdownContainer.innerHTML = counter;
    counter--;
    if (counter < 0) {
      clearInterval(intervalId);
      countdownContainer.style.display = "none";
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
