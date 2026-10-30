// ======================
// История
// ======================
import { $, $$ } from "./helpers.js";
import { refreshLayout } from "./layout.js";

export const initHistory = () => {
  const section = $(".history");
  const track = section && $(".history__track", section);
  if (!track || typeof window.Swiper === "undefined") return;

  const tabs = $$(".history__year", section);
  const panels = $$(".history__panel", section);
  const prev = $(".history__arrow--prev", section);
  const next = $(".history__arrow--next", section);
  let current = 0;

  const swiper = new window.Swiper(track, {
    slidesPerView: "auto",
    speed: 500,
    a11y: { enabled: false },
  });

  const setActive = (index, { focus = false, speed } = {}) => {
    current = Math.max(0, Math.min(tabs.length - 1, index));

    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel, i) => { panel.hidden = i !== current; });

    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === tabs.length - 1;

    swiper.slideTo(current, speed);
    if (focus) tabs[current].focus({ preventScroll: true });
    refreshLayout();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => setActive(i)));
  if (prev) prev.addEventListener("click", () => setActive(current - 1));
  if (next) next.addEventListener("click", () => setActive(current + 1));

  const keys = { ArrowLeft: () => current - 1, ArrowRight: () => current + 1, Home: () => 0, End: () => tabs.length - 1 };
  $(".history__years", section).addEventListener("keydown", (e) => {
    if (!keys[e.key]) return;
    e.preventDefault();
    setActive(keys[e.key](), { focus: true });
  });

  setActive(0, { speed: 0 });
};
