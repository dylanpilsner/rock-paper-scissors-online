import { stat } from "fs";
import { state } from "../state";

export function initLobby(param) {
  const div = document.createElement("div");
  const style = document.createElement("style");
  window.addEventListener("load", async () => {
    await state.refresh(param.goTo);
  });
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

    @media (min-width: 769px) {
      .move-container {
        gap: 45px;
      }
    }

    @media (min-width:1920px){
      .move-container{
        gap:100px;
      }
   
    }


  `;

  const { gameState } = state.getState();

  div.innerHTML =
    /*html*/
    `
    <header class="header">
    <div class="players-container">
    <span class="player-one">${gameState.name}:${gameState.yourScore}</span>
    <span class="player-two disconnected">${gameState.oponentName}: ${gameState.oponentScore}</span>
    </div>
    <div class="room-information-container">
    <span>Sala</span>
    <span class="room-code">${gameState.publicId}</span>
    </div>
    </header>
    <div class="instructions-container">
      <h1 class="title">Compart?? el c??digo: <br /> <span class="code">${gameState.publicId}</span> <br /> con tu contrincante</h1>
     </div>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;
  div.appendChild(style);

  state.redirect(param.goTo);

  return div;
}
