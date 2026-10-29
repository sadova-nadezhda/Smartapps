// ======================
// Бегущая строка (логотипы клиентов)
// ======================

import { $, $$ } from "./helpers.js";
import { s } from "./multiplier.js";

const SPEED = 60;

export const initMarquee = () => {
  $$("[data-marquee]").forEach((marquee) => {
    const track = $("[data-marquee-track]", marquee);
    const list = track && $("[data-marquee-list]", track);
    if (!list) return;

    const items = Array.from(list.children);
    let clone = null;

    const hide = (el) => {
      el.setAttribute("aria-hidden", "true");
      $$("a, button", el).forEach((node) => node.setAttribute("tabindex", "-1"));
      return el;
    };

    const imgs = $$("img", list);

    const update = () => {
      const width = marquee.clientWidth;

      if (!width || imgs.some((img) => !img.complete)) return;

      list.replaceChildren(...items);
      for (let i = 0; list.scrollWidth < width && i < 10; i++) {
        items.forEach((item) => list.append(hide(item.cloneNode(true))));
      }

      clone?.remove();
      clone = hide(list.cloneNode(true));
      track.append(clone);

      marquee.style.setProperty("--marquee-duration", `${(list.offsetWidth / s(SPEED)).toFixed(2)}s`);
      marquee.classList.add("is-running");
    };

    update();
    
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", update, { once: true });
      img.addEventListener("error", update, { once: true });
    });
    new ResizeObserver(update).observe(marquee);
  });
};
