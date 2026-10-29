// ======================
// Feedback: линии рамки (SVG)
// ======================

import { $, $$ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";
import { buildMobileFrame, slashes } from "./hero-lines.js";

const BAR_RIGHT = [[0, 13, 26, 13], [20, 33, 46, 33], [40, 53, 176, 163]];

const build = (w, h) => {
  const u = getWidthMultiplier();
  const n = (v) => Math.round(v * u * 10) / 10;

  if (window.innerWidth <= 1024) {
    const g = buildMobileFrame(w, h, n);
    return { outer: g.outer, inner: [g.inner, "", "", ""], bar: g.bar, dots: g.dots, r: g.r };
  }

  const yT = n(98.5); // линия точек у заголовка
  const yB = h - n(98.5); // линия точек у кнопки
  const c = n(59);

  return {
    outer: `M${c} .5H${w - 0.5}V${h - c}L${w - c} ${h - 0.5}H.5V${c}Z`,
    inner: [
      // Верх слева: от точки у заголовка — ступенька — внутренняя рамка с вырезами — в правый край
      `M${n(256)} ${yT}H${n(190)}V${n(155)}H${n(20)}V${n(72)}L${n(72)} ${n(20)}H${n(292.5)}L${n(308)} ${n(36.5)}` +
        `H${w - n(308)}L${w - n(281)} ${n(20)}H${w - n(20)}V${yT}H${w}`,
      // Верх справа: от точки у заголовка — ступенька — в правый край
      `M${w - n(256)} ${yT}H${w - n(190)}V${n(155)}H${w}`,
      // Низ слева: от точки у кнопки — ступенька — внутренняя рамка с вырезами — в правый край
      `M${n(520)} ${yB}H${n(370)}V${h - n(142)}H${n(20)}V${h - n(21)}H${n(280.5)}L${n(308)} ${h - n(38)}` +
        `H${w - n(309)}L${w - n(293)} ${h - n(21)}H${w - n(72.5)}L${w - n(20)} ${h - n(73.5)}H${w}`,
      // Низ справа: от точки у кнопки — ступенька — в правый край
      `M${w - n(520)} ${yB}H${w - n(370)}V${h - n(142)}H${w}`,
    ],
    bar: slashes(n, n(68), h - n(21), h - n(34)) + slashes(n, w - n(267), h - n(21), h - n(34), BAR_RIGHT),
    dots: [[n(256), yT], [w - n(256), yT], [n(520), yB], [w - n(520), yB]],
    r: n(5),
  };
};

export const initFeedbackLines = () => {
  $$(".feedback__frame").forEach((frame) => {
    const svg = $(".feedback__lines", frame);
    if (!svg) return;

    const outer = $(".feedback__line--outer", svg);
    const inners = $$(".feedback__line--inner", svg);
    const bar = $(".feedback__bar", svg);
    const dots = $$(".feedback__dot", svg);

    const render = () => {
      const { width, height } = frame.getBoundingClientRect();
      if (!width || !height) return;
      const g = build(Math.round(width), Math.round(height));

      outer.setAttribute("d", g.outer);
      inners.forEach((path, idx) => path.setAttribute("d", g.inner[idx]));
      bar.setAttribute("d", g.bar);
      // Лишние точки прячем нулевым радиусом
      dots.forEach((dot, idx) => {
        const [cx, cy] = g.dots[idx] || [0, 0];
        dot.setAttribute("cx", cx);
        dot.setAttribute("cy", cy);
        dot.setAttribute("r", g.dots[idx] ? g.r : 0);
      });
    };

    render();
    new ResizeObserver(render).observe(frame);

    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      frame.classList.add("is-ready");
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(frame);
  });
};
