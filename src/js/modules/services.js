import { $, $$ } from "./helpers.js";
import { initAccordion } from "./accordion.js";
import { refreshLayout } from "./layout.js";
import { initReveal } from "./reveal.js";
import { s } from "./multiplier.js";

// ======================
// Наши услуги
// ======================
const tabletMq = window.matchMedia("(max-width: 1024px)");
const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

// Тайминги прорисовки на десктопе, секунды
const HEAD = 0.35; // горизонталь от плашки до центра
const HEAD_LEFT = 0.5; // линия от плашки к инфо-карточке
const CENTER = 1.3; // центральная линия от плашки до CTA
const CTA = 0.3; // горизонталь от центра к CTA
const STUB = 0.2; // отвод от вертикали ветки к карточке
const CARD = 0.4; // появление карточки (совпадает с переходом в services.scss)
const GAP_LINE = 0.2; // линия в зазоре между карточками

const SVG_NS = "http://www.w3.org/2000/svg";
const sec = (v) => `${Math.max(v, 0).toFixed(3)}s`;

// Строит линии-связи в SVG от реальных позиций элементов и раздаёт тайминги прорисовки.
// Возвращает момент окончания анимации, секунды.
const renderDesktop = (section, svg) => {
  const base = svg.getBoundingClientRect();
  const box = (el) => {
    const r = el.getBoundingClientRect();
    const top = r.top - base.top;
    const left = r.left - base.left;
    return { top, left, bottom: top + r.height, right: left + r.width, mid: top + r.height / 2, center: left + r.width / 2 };
  };
  const px = (v) => Math.round(v) + 0.5; // ось 1px-линии по центру пикселя
  const r = (v) => Math.round(v * 10) / 10;

  const shapes = [];
  const line = (x1, y1, x2, y2, delay, dur) => shapes.push({ d: `M${r(x1)} ${r(y1)}L${r(x2)} ${r(y2)}`, delay, dur });
  const dot = (cx, cy, delay) => shapes.push({ cx: r(cx), cy: r(cy), delay });

  const tag = box($(".services__tag", section));
  const info = box($(".services__info", section));
  const cta = box($(".services__cta", section));
  const x = px(box($(".services__body", section)).center);
  const y0 = px(tag.top);
  const yEnd = px(cta.mid);
  const speed = (yEnd - y0) / CENTER;
  const T = (y) => HEAD + (y - y0) / speed;

  // От плашки: горизонталь к центру и вертикаль к инфо-карточке
  line(tag.right, y0, x, y0, 0, HEAD);
  line(px(tag.left), tag.bottom, px(tag.left), info.top + s(20), 0, HEAD_LEFT);
  dot(x, y0, HEAD);

  // Центральная линия до CTA и горизонталь к нему
  line(x, y0, x, yEnd, HEAD, CENTER);
  line(x, yEnd, cta.right, yEnd, T(yEnd), CTA);
  dot(x, yEnd, T(yEnd));
  let end = T(yEnd) + CTA;

  const bus = s(85); // от края карточки до вертикали ветки
  let hasRight = false;
  $$(".services__group", section).forEach((group) => {
    const isLeft = group.classList.contains("services__group--left");
    const node = box($(".services-node", group));
    const items = $$(".services__item", group).map((el) => ({ b: box(el), card: $(".service-card", el) }));

    // Точка на центральной линии под узлом (кроме второй правой группы)
    if (isLeft || !hasRight) {
      const y = box($(".services-node__toggle", group)).bottom + s(175);
      dot(x, y, T(y));
    }
    if (!isLeft) hasRight = true;

    // Край карточки и узла со стороны центра
    const edge = (b) => (isLeft ? b.right : b.left);
    const nodeEdge = isLeft ? node.left : node.right;
    const busX = px(edge(items[0].b) + (isLeft ? bus : -bus));
    const yNode = px(node.mid);
    const firstStub = Math.abs(edge(items[0].b) - nodeEdge);
    const tNode = T(yNode);
    const tBus = tNode + (firstStub - bus) / speed;
    const B = (y) => tBus + (y - yNode) / speed;
    const yLast = px(items[items.length - 1].b.mid);

    line(nodeEdge, yNode, edge(items[0].b), yNode, tNode, firstStub / speed);
    line(busX, yNode, busX, yLast, tBus, (yLast - yNode) / speed);
    dot(busX, yNode, tBus);

    items.forEach(({ b, card }, idx) => {
      let tCard = tNode + firstStub / speed;
      if (idx) {
        const y = px(b.mid);
        line(busX, y, edge(b), y, B(y), STUB);
        dot(busX, y, B(y));
        tCard = B(y) + STUB;
        // Линия в зазоре от предыдущей карточки
        const xc = px(b.center);
        line(xc, items[idx - 1].b.bottom, xc, b.top, tCard + CARD / 2, GAP_LINE);
        end = Math.max(end, tCard + CARD / 2 + GAP_LINE);
      }
      card.style.setProperty("--self-delay", sec(tCard));
      end = Math.max(end, tCard + CARD);
    });
  });

  // Элементы создаются один раз, дальше обновляются только атрибуты
  if (svg.childElementCount !== shapes.length) {
    svg.replaceChildren(...shapes.map((shape) => {
      const el = document.createElementNS(SVG_NS, shape.d ? "path" : "circle");
      el.setAttribute("class", shape.d ? "services__line" : "services__dot");
      if (shape.d) el.setAttribute("pathLength", 1);
      return el;
    }));
  }

  const radius = r(s(3.5));
  shapes.forEach((shape, idx) => {
    const el = svg.children[idx];
    if (shape.d) {
      el.setAttribute("d", shape.d);
      el.style.setProperty("--dur", sec(shape.dur));
    } else {
      el.setAttribute("cx", shape.cx);
      el.setAttribute("cy", shape.cy);
      el.setAttribute("r", radius);
    }
    el.style.setProperty("--delay", sec(shape.delay));
  });
  // Момент перекраски линий, плашки и узлов в акцентный
  section.style.setProperty("--color-delay", sec(end));

  return end;
};

export const initServices = () => {
  const section = $(".services");
  if (!section) return;

  const groups = $$(".services__group", section);
  initAccordion({
    items: groups,
    toggle: ".services-node__toggle",
    mq: tabletMq,
    defaultOpen: groups.slice(0, 1),
  });

  section.addEventListener("transitionend", (e) => {
    if (e.propertyName === "grid-template-rows" && e.target.classList.contains("services__panel")) refreshLayout();
  });

  const svg = $(".services__lines", section);
  let total = 0;
  const render = () => {
    if (svg && !tabletMq.matches) total = renderDesktop(section, svg);
  };
  render();
  new ResizeObserver(render).observe(section);

  if (reducedMq.matches) {
    section.classList.add("is-ready");
    return;
  }

  $$(".services__list", section).forEach((list) => {
    $$(".services__item", list).forEach((item, idx) => item.style.setProperty("--i", idx));
  });

  section.classList.add("is-anim");

  initReveal(section, {
    threshold: 0,
    rootMargin: "0px 0px -25% 0px",
    onReveal: () => {
      if (tabletMq.matches) {
        section.classList.add("is-ready");
        return;
      }

      render();
      section.classList.add("is-drawing");
      section.getBoundingClientRect();
      section.classList.add("is-ready");
      setTimeout(() => section.classList.remove("is-drawing"), (total + 0.1) * 1000);
    },
  });
};
