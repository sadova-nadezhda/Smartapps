// ======================
// Выпадающий список
// ======================
import { $, $$ } from "./helpers.js";

export const initDropdown = (root, { onSelect } = {}) => {
  const toggle = $(".dropdown__toggle", root);
  const list = $(".dropdown__list", root);
  const current = $(".dropdown__current", root);
  const options = $$(".dropdown__option", root);

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
  };

  const select = (option) => {
    options.forEach((o) => o.setAttribute("aria-pressed", String(o === option)));
    current.textContent = option.dataset.label || option.textContent;
    if (onSelect) onSelect(option);
  };

  toggle.addEventListener("click", () => setOpen(list.hidden));

  options.forEach((option) => option.addEventListener("click", () => {
    select(option);
    setOpen(false);
    toggle.focus();
  }));

  document.addEventListener("click", (e) => {
    if (!list.hidden && !root.contains(e.target)) setOpen(false);
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || list.hidden) return;
    setOpen(false);
    toggle.focus();
  });

  select(options.find((o) => o.getAttribute("aria-pressed") === "true") || options[0]);
};
