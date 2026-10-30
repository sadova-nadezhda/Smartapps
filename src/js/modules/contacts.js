// ======================
// Контакты: выбор города
// ======================
import { $, $$ } from "./helpers.js";
import { initDropdown } from "./dropdown.js";
import { refreshLayout } from "./layout.js";

export const initContacts = () => {
  const section = $(".contacts");
  const city = section && $(".contacts__city", section);
  if (!city) return;

  const offices = $$(".contacts__office", section);

  initDropdown(city, {
    onSelect: (option) => {
      offices.forEach((office) => { office.hidden = office.dataset.city !== option.dataset.city; });
      refreshLayout();
    },
  });
};
