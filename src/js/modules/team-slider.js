// ======================
// Слайдер «Команда»
// ======================
import { $ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";

const getGap = () => getWidthMultiplier() * (window.innerWidth <= 767 ? 8 : 20);

export const initTeamSlider = () => {
  const section = $(".team");
  const slider = section && $(".team__slider", section);
  if (!slider || typeof window.Swiper === "undefined") return;

  const swiper = new window.Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: getGap(),
    speed: 500,
    watchSlidesProgress: true,
    navigation: {
      prevEl: $(".team__arrow--prev", section),
      nextEl: $(".team__arrow--next", section),
    },
    keyboard: { enabled: false, onlyInViewport: false },
    a11y: {
      prevSlideMessage: "Предыдущий сотрудник",
      nextSlideMessage: "Следующий сотрудник",
      firstSlideMessage: "Это первый сотрудник",
      lastSlideMessage: "Это последний сотрудник",
      slideLabelMessage: "{{index}} из {{slidesLength}}",
      containerRoleDescriptionMessage: "карусель",
      itemRoleDescriptionMessage: "сотрудник",
    },
    on: {
      beforeResize(swiper) {
        swiper.params.spaceBetween = getGap();
      },
    },
  });

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) swiper.keyboard.enable();
    else swiper.keyboard.disable();
  }).observe(slider);

  return swiper;
};
