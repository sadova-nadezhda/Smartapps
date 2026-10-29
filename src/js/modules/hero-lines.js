// ======================
// Hero: линии рамки (SVG)
// ======================

import { $, $$ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";

// Плашка из трёх «слешей», стоит на линии y = by.
// parts — параллелограммы [низ-лево, верх-лево, верх-право, низ-право] в px макета от bx
const BAR = [[0, 13, 136, 123], [131, 143, 155, 143], [151, 163, 177, 164]];

export const slashes = (n, bx, by, bt, parts = BAR) =>
  parts.map(([x1, x2, x3, x4]) => `M${bx + n(x1)} ${by}L${bx + n(x2)} ${bt}H${bx + n(x3)}L${bx + n(x4)} ${by}Z`).join("");

export const buildMobileFrame = (w, h, n) => {
  const c = n(30);
  const i = n(10);
  return {
    outer: `M${c} .5H${w - 0.5}V${h - c}L${w - c} ${h - 0.5}H.5V${c}Z`,
    inner:
      `M${i} ${n(84)}V${n(42)}L${n(42)} ${i}H${w - n(118)}L${w - n(101)} ${n(26)}` +
      `H${w - i}V${h - n(41)}L${w - n(41)} ${h - i}H${i}`,
    bracket: "",
    bar: slashes(n, n(47), h - i, h - i - n(13)),
    dots: [[i, n(84)], [i, h - i]],
    r: n(4),
  };
};

export const buildFrame = (w, h) => {
  const u = getWidthMultiplier();
  const n = (v) => Math.round(v * u * 10) / 10;
  const vw = window.innerWidth;

  if (vw <= 767) return buildMobileFrame(w, h, n);

  if (vw <= 1024) {
    const c = n(48);
    const i = n(10);
    const k = c + n(4);
    return {
      outer: `M${c} .5H${w - 0.5}V${h - c}L${w - c} ${h - 0.5}H.5V${c}Z`,
      inner: `M${i} ${h - n(24)}V${k}L${k} ${i}H${w - i}V${h - k}L${w - k} ${h - i}H${w / 2}`,
      bracket: "",
      bar: "",
      dots: [[i, h - n(24)], [w / 2, h - i]],
      r: n(4),
    };
  }

  const c = n(60);
  const i = n(13);
  const bx = n(75); // левый край скобы
  const by = h - n(27); // низ скобы
  const bt = h - n(40); // верх плашки

  return {
    outer: `M${c} .5H${w - 0.5}V${h - c}L${w - c} ${h - 0.5}H.5V${c}Z`,
    inner:
      `M${i} ${h - n(31)}V${n(66)}L${n(66)} ${i}H${n(235)}L${n(252)} ${n(30)}` +
      `H${w - n(253)}L${w - n(223)} ${i}H${w - n(14)}V${h - n(66)}` +
      `L${w - n(65)} ${h - n(14)}H${w - n(228)}V${n(158)}`,
    bracket: `M${n(188)} ${n(76)}H${bx}V${by}H${w - n(253)}V${h - n(107)}`,
    bar: slashes(n, bx, by, bt),
    dots: [
      [i, h - n(31)],
      [w - n(228), n(158)],
      [n(188), n(76)],
      [w - n(253), h - n(107)],
    ],
    r: n(5),
  };
};

export const initHeroLines = () => {
  const frame = $(".hero__frame");
  const svg = frame && $(".hero__lines", frame);
  if (!svg) return;

  const outer = $(".hero__line--outer", svg);
  const inner = $(".hero__line--inner", svg);
  const bracket = $(".hero__line--bracket", svg);
  const bar = $(".hero__bar", svg);
  const dots = $$(".hero__dot", svg);

  const render = () => {
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height) return;
    const g = buildFrame(Math.round(width), Math.round(height));

    outer.setAttribute("d", g.outer);
    inner.setAttribute("d", g.inner);
    bracket.setAttribute("d", g.bracket);
    bar.setAttribute("d", g.bar);
    dots.forEach((dot, idx) => {
      const [cx, cy] = g.dots[idx] || [0, 0];
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
      dot.setAttribute("r", g.r);
    });
  };

  render();
  new ResizeObserver(render).observe(svg);

  requestAnimationFrame(() => requestAnimationFrame(() => frame.classList.add("is-ready")));
};
