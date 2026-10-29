import { $ } from "./helpers.js";

// ======================
// Аккордеон
// ======================
export const initAccordion = ({ items = [], toggle, mq = null, defaultOpen = [] } = {}) => {
  if (!items.length) return null;

  const getToggle = (item) => $(toggle, item);
  const isActive = () => !mq || mq.matches;

  const setState = (item, isOpen) => {
    item.classList.toggle("is-open", isOpen);
    if (isActive()) getToggle(item).setAttribute("aria-expanded", String(isOpen));
    else getToggle(item).removeAttribute("aria-expanded");
  };

  const close = (item) => {
    items.forEach((inner) => {
      if (inner !== item && item.contains(inner)) setState(inner, false);
    });
    setState(item, false);
  };

  const open = (item) => {
    items.forEach((other) => {
      if (other !== item && other.parentElement === item.parentElement) close(other);
    });
    setState(item, true);
  };

  // Закрыть все пункты внутри root
  const closeWithin = (root) => {
    items.forEach((item) => {
      if (root.contains(item)) setState(item, false);
    });
  };

  const reset = () => {
    const active = isActive();
    items.forEach((item) => {
      setState(item, active && defaultOpen.includes(item));
      if (active) getToggle(item).removeAttribute("tabindex");
      else getToggle(item).setAttribute("tabindex", "-1");
    });
  };

  items.forEach((item) => {
    getToggle(item).addEventListener("click", () => {
      if (!isActive()) return;
      if (item.classList.contains("is-open")) close(item);
      else open(item);
    });
  });

  reset();
  mq?.addEventListener("change", reset);

  return { open, close, closeWithin, reset };
};
