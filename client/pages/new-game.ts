import { state } from "../state";

export function initNewGame(param) {
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
  
  .input{
  
    width:322px;
    height:87px;
    border: solid 10px #182460;
    border-radius: 10px;
    font-family:Odibee Sans;
    font-size:45px;
    text-align:center;
  }
// label{
//   display:block;
// }

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
     <label class="form-label">
     <div class="your-name">Tu nombre</div> 
     <input  type="text" class="input" placeholder="Ingresa tu nombre" name="test">
     </label>
     <button class="button">
     <my-button type="submit" class="start">Empezar</my-button>
     </button>
    </form>
      <div class="move-container">
      <the-move class="hand" move="piedra"></the-move>
      <the-move move="papel"></the-move>
      <the-move move="tijera"></the-move>
    </div>
  `;

  div.appendChild(style);
  const start = div.querySelector(".start")!;
  const form: any = div.querySelector(".form")!;
  console.log(form.test.value);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target as any;
    const input = div.querySelector(".input");
    if (target["test"].value == "") {
      input.classList.add("void");
      return window.alert("Please enter your name");
    } else {
      input.classList.remove("void");
      state.setNameAndCreateOrGetUserId(target["test"].value);
      state.createNewRoom();
      param.goTo("/lobby");
    }
  });

  // start.addEventListener("click", (e) => {
  //   e.preventDefault;
  //   console.log(form.test.value);

  // state.setName()
  // });

  return div;
}
