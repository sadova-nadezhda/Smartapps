// ======================
// Контакты: выбор города
// ======================
import { $, $$ } from "./helpers.js";
import { refreshLayout } from "./layout.js";

export const initContacts = () => {
  const section = $(".contacts");
  const toggle = section && $(".contacts__city-toggle", section);
  if (!toggle) return;

  const list = $(".contacts__city-list", section);
  const current = $(".contacts__city-current", section);
  const options = $$(".contacts__city-option", section);
  const offices = $$(".contacts__office", section);

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
  };

  const select = (option) => {
    options.forEach((o) => o.setAttribute("aria-pressed", String(o === option)));
    offices.forEach((office) => { office.hidden = office.dataset.city !== option.dataset.city; });
    current.textContent = option.textContent;
    refreshLayout();
  };

  toggle.addEventListener("click", () => setOpen(list.hidden));

  options.forEach((option) => option.addEventListener("click", () => {
    select(option);
    setOpen(false);
    toggle.focus();
  }));

  // Закрытие по клику вне списка и по Esc
  document.addEventListener("click", (e) => {
    if (!list.hidden && !e.target.closest(".contacts__city")) setOpen(false);
  });

  section.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || list.hidden) return;
    setOpen(false);
    toggle.focus();
  });

  // Без JS видны все офисы; с JS — только выбранный
  select(options.find((o) => o.getAttribute("aria-pressed") === "true") || options[0]);
};
