import { initRoute } from "./router";
import "./components/button";
import "./components/moves";
import { state } from "./state";

(async function () {
  const rootEl = await document.querySelector(".root")!;
  // state.init();
  initRoute(rootEl);
  // state.listenDataBase();
})();
