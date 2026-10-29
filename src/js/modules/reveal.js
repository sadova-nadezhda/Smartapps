import { $$ } from "./helpers.js";

// ======================
// Появление при скролле: один раз, когда элемент попадает в экран.
// ======================
export const initReveal = (el, { threshold = 0.2, rootMargin = "0px", onReveal } = {}) => {
  if (!el) return;

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    if (onReveal) onReveal(el);
    else el.classList.add("is-ready");
  }, { threshold, rootMargin });

  io.observe(el);
};

// ======================
// Появление контента по data-reveal / data-reveal-stagger (стили в reveal.scss)
// ======================
const STAGGER_STEP = 100; // шаг задержки между элементами группы, мс
const STAGGER_MAX = 6; // после N-го элемента задержка не растёт (длинные списки, слайды за экраном)

const setDelay = (el, ms) => {
  if (ms) el.style.setProperty("--reveal-delay", `${ms / 1000}s`);
};

export const initRevealOnScroll = () => {
  const groups = $$("[data-reveal-stagger]");
  const singles = $$("[data-reveal]");
  if (!groups.length && !singles.length) return;

  // Группа наблюдается целиком: дети появляются вместе, с нарастающей задержкой
  groups.forEach((group) => {
    const base = Number(group.dataset.revealDelay) || 0;
    const step = Number(group.dataset.revealStep) || STAGGER_STEP;
    Array.from(group.children).forEach((child, idx) => setDelay(child, base + Math.min(idx, STAGGER_MAX) * step));
  });
  singles.forEach((el) => setDelay(el, Number(el.dataset.revealDelay) || 0));

  const show = (el) => {
    if (el.hasAttribute("data-reveal-stagger")) Array.from(el.children).forEach((child) => child.classList.add("is-revealed"));
    else el.classList.add("is-revealed");
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      // Элементы выше экрана (перезагрузка посреди страницы, якорь) показываем сразу
      if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
      io.unobserve(e.target);
      show(e.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });

  [...groups, ...singles].forEach((el) => io.observe(el));
};
