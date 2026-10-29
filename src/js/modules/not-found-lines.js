// ======================
// 404: анимация линий иллюстрации
// ======================

import { $ } from "./helpers.js";

export const initNotFoundLines = () => {
  const frame = $(".not-found__frame");
  const svg = frame && $(".not-found__illustration", frame);
  if (!svg) return;

  const render = () => {
    const scale = svg.getScreenCTM()?.a;
    if (scale) svg.style.setProperty("--line-w", (1 / scale).toFixed(3));
  };

  render();
  new ResizeObserver(render).observe(svg);

  requestAnimationFrame(() => requestAnimationFrame(() => frame.classList.add("is-ready")));
};
