import { $, $$ } from "./helpers.js";
import { initAccordion } from "./accordion.js";

// ======================
// Шапка: дропдауны, мега-меню, мобильное меню
// ======================

const desktopMq = window.matchMedia("(min-width: 1025px)");
const mobileMq = window.matchMedia("(max-width: 1024px)");
const hoverMq = window.matchMedia("(min-width: 1025px) and (hover: hover)");

const HOVER_CLOSE_DELAY = 150;
const HOVER_CLICK_GUARD = 400;

export const initHeader = ({ scrollLock } = {}) => {
  const header = $(".header");
  if (!header) return {};

  const toggleScrolled = () => header.classList.toggle("scrolled", window.scrollY > 10);
  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });

  const burger = $(".header__burger", header);
  const items = $$(".header__item", header).filter((item) => $(".header__toggle", item));
  const getToggle = (item) => $(".header__toggle", item);

  let current = null;
  let hoverTimer = null;
  let hoverOpenedAt = 0;

  const subAccordion = initAccordion({
    items: $$(".menu-service__col", header).filter((col) => $(".menu-service__title", col)),
    toggle: ".menu-service__title",
    mq: mobileMq,
  });

  const close = (item = current) => {
    if (!item) return;
    subAccordion?.closeWithin(item);
    item.classList.remove("is-open");
    getToggle(item).setAttribute("aria-expanded", "false");
    if (item === current) current = null;
  };

  const open = (item) => {
    if (current && current !== item) close(current);
    item.classList.add("is-open");
    getToggle(item).setAttribute("aria-expanded", "true");
    current = item;
  };

  items.forEach((item) => {
    getToggle(item).addEventListener("click", () => {
      if (current !== item) return open(item);
      if (hoverMq.matches && Date.now() - hoverOpenedAt < HOVER_CLICK_GUARD) return;
      close(item);
    });

    item.addEventListener("mouseenter", () => {
      if (!hoverMq.matches) return;
      clearTimeout(hoverTimer);
      if (current === item) return;
      open(item);
      hoverOpenedAt = Date.now();
    });

    item.addEventListener("mouseleave", () => {
      if (!hoverMq.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => close(item), HOVER_CLOSE_DELAY);
    });

    item.addEventListener("focusout", (e) => {
      if (desktopMq.matches && !item.contains(e.relatedTarget)) close(item);
    });
  });

  document.addEventListener("click", (e) => {
    if (desktopMq.matches && current && !current.contains(e.target)) close();
  });

  // ======================
  // Мобильное меню
  // ======================
  const isMenuOpen = () => header.classList.contains("is-menu-open");

  const setMobileMenu = (isOpen) => {
    if (!burger) return;
    header.classList.toggle("is-menu-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) scrollLock?.lock?.("menu");
    else scrollLock?.unlock?.("menu");
  };

  const closeMobileMenu = () => {
    if (!isMenuOpen()) return;
    close();
    setMobileMenu(false);
  };

  burger?.addEventListener("click", () => {
    if (isMenuOpen()) closeMobileMenu();
    else setMobileMenu(true);
  });

  $(".header__panel", header)?.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMobileMenu();
  });

  desktopMq.addEventListener("change", () => {
    close();
    closeMobileMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (isMenuOpen()) {
      closeMobileMenu();
      burger.focus();
    } else if (current) {
      const toggle = getToggle(current);
      close();
      toggle.focus();
    }
  });

  return { closeMobileMenu };
};
