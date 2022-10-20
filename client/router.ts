import { initWelcomePage } from "./pages/welcome";
import { instructions } from "./pages/instructions";
import { play } from "./pages/play";
import { results } from "./pages/results";
import { initNewGame } from "./pages/new-game";
import { initJoinGame } from "./pages/join-game";
import { initLobby } from "./pages/lobby";

const routes = [
  {
    path: /\/welcome/,
    component: initWelcomePage,
  },
  {
    path: /\/instructions/,
    component: instructions,
  },
  {
    path: /\/play/,
    component: play,
  },
  {
    path: /\/results/,
    component: results,
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

  function goTo(path) {
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
