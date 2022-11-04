export function initWelcomePage(param) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.classList.add("main-container");
    style.innerHTML =
        /*css*/
        `
    .main-container{
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
    }
  .title{
    font-family:Anton;
    color: #009048;
    letter-spacing: 5px;
    font-size:70px;
    margin:20px 0 0;
    text-align:center;
    line-height:80px;
  }

  @media(min-width:1366px){
    .title{
      line-height:80px;

    }
  }

  .button-container{
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:20px;
  }

  .move-container{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap:20px;
    /* height:100%; */
    margin-top:10px;
    align-items:flex-end ;
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
    div.innerHTML =
        /*html*/
        `
    <div class="welcome-container">
      <h1 class="title">Piedra, <br />Papel o <br />Tijera</h1>
     </div>
     <div class="button-container">
      <my-button class="new-game">Nueva partida</my-button>
      <my-button class="join-game">Ingresar a una sala</my-button>
    </div>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;
    div.appendChild(style);
    const newGame = div.querySelector(".new-game");
    newGame.addEventListener("click", (e) => {
        e.preventDefault;
        param.goTo("/new-game");
    });
    const joinGame = div.querySelector(".join-game");
    joinGame.addEventListener("click", (e) => {
        e.preventDefault;
        param.goTo("/join-game");
    });
    return div;
}
