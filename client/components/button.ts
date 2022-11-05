class Button extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const button = document.createElement("button");
    const style = document.createElement("style");
    button.classList.add("button");
    style.innerHTML =
      /*css*/
      `
    .button{
      background-color:#006CFC;
      font-family: Odibee Sans;
      width:322px;
      height:87px;
      font-size:45px;
      color:#D8FCFC;
      border:10px #001997 solid;
      border-radius:10px;
      cursor:pointer;
    }
    
    @media (min-width:1366px){
    .button{
      height:80px
    }
  }
    @media (min-width:1920px){
    .button{
      width:404px;
    }
  }
    
    .button:hover{
      background-color:#0056ca;
    }
    
    `;

    button.textContent = this.textContent;
    shadow.appendChild(button);
    shadow.appendChild(style);
  }
}

customElements.define("my-button", Button);
