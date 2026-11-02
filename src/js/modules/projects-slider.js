// ======================
// Слайдер «Наши проекты»
// ======================
import { $ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";
import { sliderProgressEvents } from "./slider-progress.js";

const getGap = () => getWidthMultiplier() * (window.innerWidth <= 767 ? 12 : 24);

export const initProjectsSlider = () => {
  const section = $(".projects");
  const slider = section && $(".projects__slider", section);
  if (!slider || typeof window.Swiper === "undefined") return;

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
      ...sliderProgressEvents($(".slider-progress__fill", section)),
    },
  });

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) swiper.keyboard.enable();
    else swiper.keyboard.disable();
  }).observe(slider);

  return swiper;
};
