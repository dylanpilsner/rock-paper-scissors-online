import { state } from "../state";

export function initLobby(param) {
  const div = document.createElement("div");
  const style = document.createElement("style");

  div.classList.add("main-container");

  style.innerHTML =
    /*css*/
    `
  .main-container{
      height:100%;
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
    }
    .header {
      width:100%;
      display:flex;
      justify-content:space-around;
      padding:10px 0 0 0
    }
    .players-container {
      display:flex;
      flex-direction: column;
      text-align: left;
      gap:7px;
      font-size:24px;
    }
    
    .player-one {
    }
    .disconnected{
      display:none;
    }
    
    .connected {
      display:inherit;
      color:#FF6442
    }
    .room-information-container {
      display: flex;
      flex-direction: column;
      text-align: center;
      gap:7px;
      font-size:24px;
    }
    .room-code {
    
    }
    
    .instructions-container{
      height: 100%;
      display:flex;
    }
    
    .title{
      color: black;
      letter-spacing: 5px;
      font-size:35px;
      margin:20px 0 0;
      text-align:center;
      align-self:center;
      line-height:80px;
    }
    
    .code{
      color:#1d4985;
      font-size: 50px;
    }
    
    .move-container{
      display:flex;
      gap:20px;
      align-items: flex-end;
    }



  `;

  const { gameState } = state.getState();

  div.innerHTML =
    /*html*/
    `
    <header class="header">
    <div class="players-container">
    <span class="player-one">${gameState.name}:${gameState.yourScore}</span>
    <span class="player-two">${gameState.oponentName}: ${gameState.oponentScore}</span>
    </div>
    <div class="room-information-container">
    <span>Sala</span>
    <span class="room-code">${gameState.publicId}</span>
    </div>
    </header>
    <div class="instructions-container">
      <h1 class="title">Compartí el código: <br /> <span class="code">${gameState.publicId}</span> <br /> con tu contrincante</h1>
     </div>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;
  div.appendChild(style);

  const playerTwo = div.querySelector(".player-two");
  if (gameState.oponentName == "") {
    playerTwo.classList.add("disconnected");
  } else {
    playerTwo.classList.add("connected");
  }

  window.addEventListener("beforeunload", async (e) => {
    await state.disconnectPlayer();
  });

  // const form: any = div.querySelector(".form")!;
  // console.log(form.test.value);

  // form.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   const target = e.target as any;
  //   const input = div.querySelector(".input");
  //   if (target["test"].value == "") {
  //     input.classList.add("void");
  //     return window.alert("Please enter your name");
  //   } else {
  //     input.classList.remove("void");
  //     // state.setNameAndCreateOrGetUserId(target["test"].value);
  //     // state.createNewRoom();
  //     param.goTo("/lobby");
  //   }
  // });

  // start.addEventListener("click", (e) => {
  //   e.preventDefault;
  //   console.log(form.test.value);

  // state.setName()
  // });

  return div;
}
