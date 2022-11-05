import { initRoute } from "./router";
import "./components/button";
import "./components/moves";
import { state } from "./state";

(async function () {
  state.init();
  const rootEl = document.querySelector(".root")!;
  initRoute(rootEl);
  window.addEventListener("beforeunload", async (e) => {
    state.resetData();
    state.disconnectPlayer();
  });
})();
