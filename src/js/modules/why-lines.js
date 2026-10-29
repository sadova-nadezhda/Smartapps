// ======================
// Why: линии рамки (SVG)
// ======================
// Пути строятся в пикселях от реальных позиций плашки и блока с сеткой.
import { $, $$ } from "./helpers.js";
import { getWidthMultiplier } from "./multiplier.js";

export const initWhyLines = () => {
  const section = $(".why");
  const inner = section && $(".why__inner", section);
  const svg = inner && $(".why__lines", inner);
  if (!svg) return;

  const tag = $(".why__tag", inner);
  const body = $(".why__body", inner);
  const intro = $(".why__intro", inner);
  const top = $(".why__line--top", svg);
  const left = $(".why__line--left", svg);
  const divider = $(".why__line--divider", svg);
  const leaders = $$(".why__line--leader", svg);
  const dots = $$(".why__dot", svg);
  const items = $$(".why__item", inner);

  const render = () => {
    const box = inner.getBoundingClientRect();
    if (!box.width) return;

    const u = getWidthMultiplier();
    const n = (v) => Math.round(v * u * 10) / 10;
    const r = (v) => Math.round(v * 10) / 10;
    const w = r(box.width);
    const t = tag.getBoundingClientRect();
    const tagMid = r(t.top - box.top + t.height / 2);
    const tagBottom = r(t.bottom - box.top);
    const yDiv = r(body.getBoundingClientRect().top - box.top);

    if (window.innerWidth <= 1024) {
      const lead = n(16);
      const tops = items.map((item) => r(item.getBoundingClientRect().top - box.top));
      const bottom = r(Math.max(...items.map((item) => item.getBoundingClientRect().bottom)) - box.top);

      divider.setAttribute("d", "");
      top.setAttribute("d", "");
      left.setAttribute("d", `M.5 ${tagBottom}V${bottom}`);
      dots[0].setAttribute("cx", 0.5);
      dots[0].setAttribute("cy", bottom);
      dots[0].setAttribute("r", n(4));
      tops.forEach((y, idx) => {
        leaders[idx].setAttribute("d", `M.5 ${r(y + lead)}L${lead} ${y}H${n(169)}`);
        dots[idx + 2].setAttribute("cx", 0.5);
        dots[idx + 2].setAttribute("cy", r(y + lead));
        dots[idx + 2].setAttribute("r", n(4));
      });
      return;
    }

    const yEnd = yDiv + n(270); // нижние горизонтали
    const lead = n(35); // катет диагонали выноски (45°)

    const points = [
      [n(526), yDiv + lead],
      [w - n(526), yDiv + lead],
      [n(428), yEnd + lead],
      [w - n(428), yEnd + lead],
    ];
    points.forEach(([x, y], idx) => {
      const dir = idx % 2 ? -1 : 1;
      const x0 = r(x - dir * lead);
      const start = idx < 2 ? `M${x0} ${yDiv}` : `M${dir > 0 ? 0.5 : w - 0.5} ${yEnd}H${x0}`;
      leaders[idx].setAttribute("d", `${start}L${x} ${y}`);
    });

    // Разделитель разорван между верхними выносками 
    divider.setAttribute("d", `M.5 ${yDiv}H${r(points[0][0] - lead)}M${w - 0.5} ${yDiv}H${r(points[1][0] + lead)}`);

    // Боковые линии заканчиваются точками на уровне первой строки нижних заголовков
    const yDot = r(yEnd + n(29));
    const introLeft = r(intro.getBoundingClientRect().left - box.left);
    top.setAttribute("d", `M${introLeft} ${tagMid}H${w - 0.5}V${yDot}`);
    left.setAttribute("d", `M.5 ${tagBottom}V${yDot}`);

    [[0.5, yDot], [w - 0.5, yDot], ...points].forEach(([cx, cy], idx) => {
      dots[idx].setAttribute("cx", cx);
      dots[idx].setAttribute("cy", cy);
      dots[idx].setAttribute("r", n(5));
    });
  };

  render();
  new ResizeObserver(render).observe(inner);

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    section.classList.add("is-ready");
    io.disconnect();
  }, { threshold: 0.2 });
  io.observe(section);
};
