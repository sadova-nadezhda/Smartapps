// ======================
// Слайдер «Наши проекты»
// ======================
import { $ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";

const getGap = () => getWidthMultiplier() * (window.innerWidth <= 767 ? 12 : 24);

export const initProjectsSlider = () => {
  const section = $(".projects");
  const slider = section && $(".projects__slider", section);
  if (!slider || typeof window.Swiper === "undefined") return;

  const fill = $(".projects__progress-fill", section);

  const updateProgress = (swiper) => {
    if (!fill) return;
    const visible = Math.min(1, swiper.width / swiper.virtualSize) || 1;
    const progress = Math.min(1, Math.max(0, swiper.progress || 0));
    fill.style.setProperty("--progress", visible + (1 - visible) * progress);
  };

  const swiper = new window.Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: getGap(),
    speed: 500,
    watchSlidesProgress: true,
    navigation: {
      prevEl: $(".projects__arrow--prev", section),
      nextEl: $(".projects__arrow--next", section),
    },
    keyboard: { enabled: false, onlyInViewport: false },
    a11y: {
      prevSlideMessage: "Предыдущий проект",
      nextSlideMessage: "Следующий проект",
      firstSlideMessage: "Это первый проект",
      lastSlideMessage: "Это последний проект",
      slideLabelMessage: "{{index}} из {{slidesLength}}",
      containerRoleDescriptionMessage: "карусель",
      itemRoleDescriptionMessage: "проект",
    },
    on: {
      beforeResize(swiper) {
        swiper.params.spaceBetween = getGap();
      },
      init: updateProgress,
      progress: updateProgress,
      resize: updateProgress,
      setTransition(swiper, duration) {
        if (fill) fill.style.transitionDuration = `${duration}ms`;
      },
    },
  });

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) swiper.keyboard.enable();
    else swiper.keyboard.disable();
  }).observe(slider);

  return swiper;
};
