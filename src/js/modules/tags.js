// ======================
// Плашки tag
// ======================
import { $$ } from "./helpers.js";
import { initReveal } from "./reveal.js";

export const initTags = () => {
  $$(".tag").forEach((tag) => {
    initReveal(tag.parentElement, {
      threshold: 0,
      rootMargin: "0px 0px -15% 0px",
      onReveal: () => tag.classList.add("is-ready"),
    });
  });
};
