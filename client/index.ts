import { initRoute } from "./router";
import "./components/button";
import "./components/moves";
import { state } from "./state";

(function () {
  const rootEl = document.querySelector(".root");
  // state.init();
  initRoute(rootEl);
})();
