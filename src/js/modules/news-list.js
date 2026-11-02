// ======================
// Блог: «Показать еще»
// ======================
import { $, $$ } from "./helpers.js";
import { refreshLayout } from "./layout.js";

const PAGE_SIZE = 8;

export const initNewsList = () => {
  const section = $(".news");
  if (!section) return;

  const cards = $$(".news-card", section);
  const more = $(".news__more", section);
  let limit = PAGE_SIZE;

  const render = () => {
    cards.forEach((card, idx) => { card.hidden = idx >= limit; });
    more.hidden = cards.length <= limit;
    refreshLayout();
  };

  more.addEventListener("click", () => {
    const first = cards[limit];
    limit += PAGE_SIZE;
    render();

    if (more.hidden) $(".news-card__link", first).focus({ preventScroll: true });
  });

  render();
};
