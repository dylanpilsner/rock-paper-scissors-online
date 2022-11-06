import { state } from "../state";

export function initWaitingRoom(param) {
  const div = document.createElement("div");
  const style = document.createElement("style");
  const currentState = state.getState();
  div.classList.add("main-container");
  window.addEventListener("load", async () => {
    await state.refresh(param.goTo);
  });

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
    
    .instructions{
      color: black;
      letter-spacing: 5px;
      font-size:35px;
      margin:20px 0 0;
      text-align:center;
      align-self:center;
      line-height:60px;
    }


    @media (min-width:1700px){
      .instructions{
        width:1000px;
        font-size:50px;
      }
    }
    
    .code{
      color:#1d4985;
      font-size: 50px;
    }
    
    .move-container{
      display:flex;
      gap:20px;
      align-items: flex-end;
      margin-top:50px;
    }

    @media (min-width: 769px) {
      .move-container {
        gap: 45px;
      }
    }

    @media (min-width:1700px){
      .move-container{
        margin-top:200px;
        gap:80px;
      }
   
    }
  `;

  const { gameState } = state.getState();

  div.innerHTML =
    /*html*/
    `

    <header class="header">
    <div class="players-container">
    <span class="player-one">${gameState.name}: ${gameState.yourScore}</span>
    <span class="player-two connected">${gameState.opponentName}: ${gameState.opponentScore}</span>
    </div>
    <div class="room-information-container">
    <span>Sala</span>
    <span class="room-code">${gameState.publicId}</span>
    </div>
    </header>
    <div class="instructions-container">
      <h1 class="instructions">Presioná jugar
      y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</h1>
     </div>
     <my-button class="start-button">¡Jugar!</my-button>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>

  `;
  state.setOpponentInformation();

  const startButton = div.querySelector(".start-button")!;
  startButton.addEventListener("click", async (e) => {
    await state.setPLayerStatus(true);
    if (currentState.redirect == false) {
      state.redirect(param.goTo);
    }
  });

  div.appendChild(style);

  return div;
}
