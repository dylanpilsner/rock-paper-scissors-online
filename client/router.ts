import { initWelcomePage } from "./pages/welcome";
import { initPlayPage } from "./pages/play";
import { initResultsPage } from "./pages/results";
import { initNewGame } from "./pages/new-game";
import { initJoinGame } from "./pages/join-game";
import { initLobby } from "./pages/lobby";
import { initWaitingRoom } from "./pages/waiting-room";
import { initWaitingOpponent } from "./pages/waiting-opponent";

const routes = [
  {
    path: /\/welcome/,
    component: initWelcomePage,
  },
  {
    path: /\/play/,
    component: initPlayPage,
  },
  {
    path: /\/results/,
    component: initResultsPage,
  },
  {
    path: /\/new-game/,
    component: initNewGame,
  },
  {
    path: /\/join-game/,
    component: initJoinGame,
  },
  {
    path: /\/lobby/,
    component: initLobby,
  },
  {
    path: /\/waiting-room/,
    component: initWaitingRoom,
  },
  {
    path: /\/waiting-opponent/,
    component: initWaitingOpponent,
  },
];

export function initRoute(container: Element) {
  const BASE_PATH = "/rock-paper-scissor";
  function handleRoute(route) {
    for (let r of routes) {
      if (r.path.test(route)) {
        const componentes = r.component as any;
        const el = componentes({ goTo: goTo });
        container.firstChild?.remove();
        container.appendChild(el);
      }
    }
  }

  async function goTo(path) {
    const completePath = path;
    history.pushState({}, "", completePath);
    handleRoute(completePath);
  }

  if (location.pathname == "/") {
    goTo("/welcome");
  }

  window.onpopstate = () => {
    handleRoute(location.pathname);
  };

  handleRoute(location.pathname);
}
