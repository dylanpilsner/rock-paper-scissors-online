const piedra = require("url:../assets/piedra.png");
const papel = require("url:../assets/papel.png");
const tijera = require("url:../assets/tijera.png");

class Moves extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    const style = document.createElement("style");
    const move = this.getAttribute("move");
    const state = this.getAttribute("state");
    div.classList.add("hand-container");
    function returnImage(theMove) {
      if (theMove == "piedra") {
        return piedra;
      } else if (theMove == "papel") {
        return papel;
      } else return tijera;
    }

    style.innerHTML =
      /*css*/
      `
      .hand-container{
        display:flex;
      }
  .hand{
    height:128px;

  }
  
  .hand.final-choice{
    height:200px;
  }

  `;

    div.innerHTML =
      /*html*/

      ` <img class="hand ${state}" src=${returnImage(move)} /> `;
    shadow.appendChild(div);
    shadow.appendChild(style);
  }
}

customElements.define("the-move", Moves);
