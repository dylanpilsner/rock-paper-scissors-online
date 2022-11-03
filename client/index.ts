import { initRoute } from "./router";
import "./components/button";
import "./components/moves";
import { state } from "./state";

(async function () {
  state.init();
  const rootEl = await document.querySelector(".root")!;
  // state.init();
  initRoute(rootEl);
  window.addEventListener("beforeunload", async (e) => {
    state.disconnectPlayer();
    state.setPLayerStatus(false);
  });
  // state.listenDataBase();
})();
