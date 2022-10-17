export function initWelcomePage() {
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
    margin:0 0 20px;
    text-align:center;
  }

  .button-container{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:20px;
  }

  


  `;

  div.innerHTML =
    /*html*/
    `
    <div class="welcome-container">
      <h1 class="title">Piedra, <br />Papel o <br />Tijera</h1>
     </div>
     <div class="button-container">
      <my-button>Nueva partida</my-button>
      <my-button>Ingresar a una sala</my-button>
    </div>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;

  div.appendChild(style);
  return div;
}
