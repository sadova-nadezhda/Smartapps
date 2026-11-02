// ======================
// Слайдеры карточек
// ======================
import { $ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";
import { sliderProgressEvents } from "./slider-progress.js";

const getGap = () => getWidthMultiplier() * (window.innerWidth <= 767 ? 8 : 20);

const initCardSlider = (name, { first, last, item }) => {
  const section = $(`.${name}`);
  const slider = section && $(`.${name}__slider`, section);
  if (!slider || typeof window.Swiper === "undefined") return;

  return new window.Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: getGap(),
    speed: 500,
    watchSlidesProgress: true,
    a11y: {
      firstSlideMessage: first,
      lastSlideMessage: last,
      slideLabelMessage: "{{index}} из {{slidesLength}}",
      containerRoleDescriptionMessage: "карусель",
      itemRoleDescriptionMessage: item,
    },
    on: {
      beforeResize(swiper) {
        swiper.params.spaceBetween = getGap();
      },
      ...sliderProgressEvents($(".slider-progress__fill", section)),
    },
  });
};

export const initDirectionsSlider = () => initCardSlider("directions", {
  first: "Это первое направление",
  last: "Это последнее направление",
  item: "направление",
});

export const initSolutionsSlider = () => initCardSlider("solutions", {
  first: "Это первое решение",
  last: "Это последнее решение",
  item: "решение",
});

export const initNewsRelatedSlider = () => initCardSlider("news-related", {
  first: "Это первая статья",
  last: "Это последняя статья",
  item: "статья",
});
