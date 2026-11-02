// ======================
// Полоса прогресса слайдера: события для on у Swiper
// ======================
export const sliderProgressEvents = (fill) => {
  if (!fill) return {};

  const update = (swiper) => {
    const visible = Math.min(1, swiper.width / swiper.virtualSize) || 1;
    const progress = Math.min(1, Math.max(0, swiper.progress || 0));
    fill.style.setProperty("--progress", visible + (1 - visible) * progress);
  };

  return {
    init: update,
    progress: update,
    resize: update,
    setTransition(swiper, duration) {
      fill.style.transitionDuration = `${duration}ms`;
    },
  };
};
