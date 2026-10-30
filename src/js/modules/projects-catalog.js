// ======================
// Каталог проектов: фильтры и «Показать еще»
// ======================
import { $, $$ } from "./helpers.js";
import { initDropdown } from "./dropdown.js";
import { refreshLayout } from "./layout.js";

const PAGE_SIZE = 9;

export const initProjectsCatalog = () => {
  const section = $(".projects-catalog");
  if (!section) return;

  const cards = $$(".project-card", section);
  const more = $(".projects-catalog__more", section);
  const empty = $(".projects-catalog__empty", section);
  const filters = {};
  let limit = PAGE_SIZE;

  const getMatched = () => cards.filter((card) => (
    Object.entries(filters).every(([key, value]) => !value || card.dataset[key] === value)
  ));

  const render = () => {
    const matched = getMatched();
    cards.forEach((card) => { card.hidden = !matched.slice(0, limit).includes(card); });
    more.hidden = matched.length <= limit;
    empty.hidden = matched.length > 0;
    refreshLayout();
  };

  $$(".projects-catalog__filter", section).forEach((filter) => {
    initDropdown(filter, {
      onSelect: (option) => {
        filters[filter.dataset.filter] = option.dataset.value;
        limit = PAGE_SIZE;
        render();
      },
    });
  });

  more.addEventListener("click", () => {
    const first = getMatched()[limit];
    limit += PAGE_SIZE;
    render();

    if (more.hidden) $(".project-card__link", first).focus({ preventScroll: true });
  });
};
