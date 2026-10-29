import { $$ } from "./helpers.js";

// ======================
// Тема (светлая/тёмная), выбор хранится в localStorage
// ======================

const STORAGE_KEY = "theme";

const getTheme = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export const initThemeToggle = () => {
  const toggles = $$(".theme-toggle");
  if (!toggles.length) return;

  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    toggles.forEach((btn) => btn.setAttribute("aria-checked", String(theme === "dark")));
  };

  apply(getTheme());

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage недоступен (приватный режим) — тема работает до перезагрузки
      }
    });
  });
};
