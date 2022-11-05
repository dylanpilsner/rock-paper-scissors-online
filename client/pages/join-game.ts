import { state } from "../state";

export function initJoinGame(param) {
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

  .your-name{
    font-size: 45px;
    font-weight:400;
    text-align:center;
    font-family:Odibee Sans;
  }

.input-container{
  width:100%
}

  .form{
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

  .inputs-container{
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  .input-name{

    width:322px;
    height:87px;
    border: solid 10px #182460;
    border-radius: 10px;
    font-family:Odibee Sans;
    font-size:45px;
    text-align:center;
  }
  .input-code{

    width:322px;
    height:87px;
    border: solid 10px #182460;
    border-radius: 10px;
    font-family:Odibee Sans;
    font-size:45px;
    text-align:center;
  }



  @media (min-width:1366px){
    .input-name{
      height:80px;
    }
    .input-code{
      height:80px;
    }
  }
  @media (min-width:1920px){
    .input-name{
      width:404px;
    }
    .input-code{
      width:404px;
    }
  }

  .button{
    background-color:transparent;
    border:none;
  }

  .void{
    border: solid 10px #cb0000;
    border-radius: 10px;
  }
  `;

  div.innerHTML =
    /*html*/
    `
    <div class="welcome-container">
      <h1 class="title">Piedra, <br />Papel o <br />Tijera</h1>
     </div>
     <form class="form">
     <div class="inputs-container">
     <input class="input-name" placeholder="Ingresa tu nombre" name="name">
     <input class="input-code" placeholder="Código" name="code">
     </div>
     <button class="button">
     <my-button>Empezar</my-button>
     </button>
    </form>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;

  div.appendChild(style);

  const form: any = div.querySelector(".form")!;

  form.addEventListener("submit", async (e) => {
    const inputName = div.querySelector(".input-name")!;
    const inputCode = div.querySelector(".input-code")!;
    e.preventDefault();
    const target = e.target as any;
    const name = target["name"].value;
    const code = target["code"].value;
    if (name == "" && code == "") {
      inputName.classList.add("void");
      inputCode.classList.add("void");
      return window.alert("Please enter the name and code room");
    } else if (name == "") {
      inputName.classList.add("void");
      return window.alert("Please enter your name");
    } else if (code == "") {
      inputCode.classList.add("void");
      return window.alert("Please enter the code room");
    } else {
      await state.setNameAndCreateOrGetUserId(target["name"].value);

      if (
        (await state.getRoomInformation(target["code"].value)) ==
        "room inexistente"
      ) {
        window.alert(
          "Esta sala no existe, por favor verifique nuevamente el código o cree una nueva sala."
        );
      } else {
        let roomStatus = await state.joinGame();
        if (roomStatus.message == "sala llena") {
          window.alert(
            "La sala se encuentra llena, por favor ingrese a otra o cree una nueva."
          );
          location.reload();
        } else {
          await state.listenDatabase();
          await state.setNameAndCreateOrGetUserId(target["name"].value);
          param.goTo("/lobby");
        }
      }
    }
  });
  return div;
}
