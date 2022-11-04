import { state } from "../state";
export function initPlayPage(param) {
    let counter = 2;
    const div = document.createElement("div");
    const style = document.createElement("style");
    state.redirect(() => { }, "dos");
    state.setOpponentInformation();
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
    position:absolute;
    bottom:0;
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

  
  @media (min-width:1920px){
    .moves-container{
      gap:100px;
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
  <div class="moves-container">
  <the-move state="play" move="piedra" class="piedra"></the-move>
  <the-move state="play" move="papel" class="papel"></the-move>
  <the-move state="play" move="tijera" class="tijera"></the-move>
  </div>
  `;
    const choice = div.querySelectorAll("the-move");
    choice.forEach(async (i) => {
        i.addEventListener("click", async (e) => {
            const target = e.target;
            const move = target.getAttribute("move");
            const piedra = div.querySelector(".piedra");
            const papel = div.querySelector(".papel");
            const tijera = div.querySelector(".tijera");
            await state.setChoice(move);
        });
    });
    state.subscribe(() => {
        const { gameState } = state.getState();
        const piedra = div.querySelector(".piedra");
        const papel = div.querySelector(".papel");
        const tijera = div.querySelector(".tijera");
        if (gameState.choice == "piedra") {
            piedra.classList.add("chosen");
            papel.classList.add("not-chosen");
            tijera.classList.add("not-chosen");
        }
        else if (gameState.choice == "papel") {
            papel.classList.add("chosen");
            piedra.classList.add("not-chosen");
            tijera.classList.add("not-chosen");
        }
        else if (gameState.choice == "tijera") {
            tijera.classList.add("chosen");
            piedra.classList.add("not-chosen");
            papel.classList.add("not-chosen");
        }
    });
    const intervalId = setInterval(async () => {
        const countdownContainer = div.querySelector(".countdown-container");
        const { gameState } = state.getState();
        countdownContainer.innerHTML = counter;
        counter--;
        if (counter < 0) {
            clearInterval(intervalId);
            countdownContainer.style.display = "none";
            await state.listenPlay();
            await state.updateScore();
            await state.setPLayerStatus(false);
            state.setRedirectStatus(false);
            setTimeout(() => {
                if (gameState.opponentChoice === "" || gameState.choice === "") {
                    console.log("testeando if");
                    state.setChoice("", true);
                    param.goTo("/waiting-room");
                }
                else {
                    param.goTo("/results");
                }
            }, 600);
        }
    }, 1000);
    div.appendChild(style);
    return div;
}
