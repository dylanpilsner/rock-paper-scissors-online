import { initWelcomePage } from "./pages/welcome";
import { instructions } from "./pages/instructions";
import { play } from "./pages/play";
import { results } from "./pages/results";

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
  ,
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
