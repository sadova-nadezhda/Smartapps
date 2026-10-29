// ======================
// Живая сетка рельефа (canvas)
// ======================
// Изометрическая сетка N×N, высоты — сумма медленно плывущих волн + гребень.
import { $ } from "./helpers.js";

const N = 60; // ячеек по стороне
const SPEED = 0.35; // скорость движения рельефа

const height = (u, v, t) => {
  const ridgeX = u + 0.04 + 0.05 * Math.sin(v * 4 + t * 0.5);
  return (
    0.16 * Math.sin(u * 5.1 + t * 0.6 + 1.3 * Math.sin(v * 2.7 - t * 0.3)) +
    0.1 * Math.sin(v * 6.3 - t * 0.45 + 1.7 * Math.sin(u * 3.1 + t * 0.2)) +
    0.04 * Math.sin((u + v) * 11 + t * 0.8) +
    0.3 * Math.exp(-(ridgeX * ridgeX) / 0.006) * (0.6 + 0.4 * Math.sin(v * 3 - t * 0.4))
  );
};

export const initTerrain = (selector = ".why__terrain") => {
  const canvas = $(selector);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const xs = new Float32Array((N + 1) * (N + 1));
  const ys = new Float32Array((N + 1) * (N + 1));
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let visible = false;
  // Цвет линий задаётся в CSS отдельно для каждой темы,
  let color = "";
  let bg = "";
  const readColors = () => {
    const style = getComputedStyle(canvas);
    color = style.color;
    bg = style.getPropertyValue("--color-bg").trim();
  };
  readColors();

  const draw = (time) => {
    const t = time * 0.001 * SPEED;
    const a = w * 0.49; // полуширина ромба
    const b = a * 0.5; // полувысота ромба
    const lift = a * 0.32; // масштаб высот
    const cx = w / 2;
    const cy = h * 0.53;

    for (let i = 0; i <= N; i++) {
      const u = i / N - 0.5;
      for (let j = 0; j <= N; j++) {
        const v = j / N - 0.5;
        const k = i * (N + 1) + j;
        xs[k] = cx + (u - v) * a;
        ys[k] = cy + (u + v) * b - height(u, v, t) * lift;
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;

    // Скрытие невидимых линий
    for (let s = 0; s <= 2 * N - 2; s++) {
      ctx.beginPath();
      for (let i = Math.max(0, s - N + 1); i <= Math.min(N - 1, s); i++) {
        const p = i * (N + 1) + s - i; // вершина (i, j)
        const q = p + N + 1; // вершина (i + 1, j)
        ctx.moveTo(xs[p], ys[p]);
        ctx.lineTo(xs[q], ys[q]);
        ctx.lineTo(xs[q + 1], ys[q + 1]);
        ctx.lineTo(xs[p + 1], ys[p + 1]);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();
    }
  };

  const loop = (time) => {
    draw(time);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (!raf && visible && !reduced) raf = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  new ResizeObserver(() => {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    w = box.width;
    h = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    draw(performance.now());
  }).observe(canvas);

  // Смена темы
  new MutationObserver(() => {
    readColors();
    if (w && h) draw(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Анимация идёт только пока сетка на экране
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(canvas);
};
