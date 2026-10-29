// Точка входа → dist/js/main.js (esbuild, один файл)
import { debounce } from "./modules/helpers.js";
import { updateMultiplier } from "./modules/multiplier.js";
import { refreshLayout } from "./modules/layout.js";
import { initLenis } from "./modules/lenis.js";
import { createScrollLock } from "./modules/scroll-lock.js";
import { initModals } from "./modules/modals.js";
import { initPhoneMask } from "./modules/phone-mask.js";
import { initHeroLines } from "./modules/hero-lines.js";
import { initWhyLines } from "./modules/why-lines.js";
import { initTerrain } from "./modules/terrain.js";
import { initMarquee } from "./modules/marquee.js";
import { initServices } from "./modules/services.js";
import { initProjectsSlider } from "./modules/projects-slider.js";
import { initFeedbackLines } from "./modules/feedback-lines.js";
import { initNotFoundLines } from "./modules/not-found-lines.js";
import { initHeader } from "./modules/header.js";
import { initThemeToggle } from "./modules/theme.js";
import { initTags } from "./modules/tags.js";
import { initRevealOnScroll } from "./modules/reveal.js";

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    updateMultiplier();
    const lenis = initLenis();
    const scrollLock = createScrollLock(lenis);

    const { closeMobileMenu } = initHeader({ scrollLock });
    initThemeToggle();
    initPhoneMask();
    initTags();
    initRevealOnScroll();
    initHeroLines();
    initWhyLines();
    initTerrain();
    initMarquee();
    initServices();
    initProjectsSlider();
    initFeedbackLines();
    initNotFoundLines();
    const modals = initModals({ scrollLock, closeMobileMenu });

    refreshLayout();

    window.addEventListener("resize", debounce(() => {
      updateMultiplier();
      refreshLayout();
    }, 150));
  });
})();
