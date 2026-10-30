// ======================
// Зона загрузки файла: проверка, имя файла, удаление
// ======================
import { $, $$ } from "./helpers.js";

const MB = 1024 * 1024;

const formatSize = (bytes) => (bytes >= MB ? `${(bytes / MB).toFixed(1)} МБ` : `${Math.ceil(bytes / 1024)} КБ`);

export const initFileUpload = () => {
  $$("[data-upload]").forEach((zone) => {
    const input = $('input[type="file"]', zone);
    const title = $("[data-upload-title]", zone);
    const hint = $("[data-upload-hint]", zone);
    const remove = $("[data-upload-remove]", zone);
    if (!input || !title || !hint || !remove) return;

    const defaults = { title: title.textContent, hint: hint.textContent };
    const maxSize = Number(zone.dataset.uploadMax) * MB;
    const extensions = input.accept.split(",").map((ext) => ext.trim().toLowerCase());

    const getError = (file) => {
      if (!extensions.some((ext) => file.name.toLowerCase().endsWith(ext))) return "Неверный формат. Нужен PDF, DOC или DOCX";
      if (file.size > maxSize) return `Файл больше ${zone.dataset.uploadMax} МБ`;
      return "";
    };

    const reset = () => {
      input.value = "";
      zone.classList.remove("is-filled", "is-error");
      title.textContent = defaults.title;
      hint.textContent = defaults.hint;
      remove.hidden = true;
    };

    input.addEventListener("change", () => {
      const file = input.files[0];
      reset();
      if (!file) return;

      const error = getError(file);
      if (error) {
        zone.classList.add("is-error");
        hint.textContent = error;
        return;
      }

      // reset() очистил поле, поэтому возвращаем проверенный файл
      const data = new DataTransfer();
      data.items.add(file);
      input.files = data.files;

      zone.classList.add("is-filled");
      title.textContent = file.name;
      hint.textContent = formatSize(file.size);
      remove.hidden = false;
    });

    input.addEventListener("dragenter", () => zone.classList.add("is-drag"));
    ["dragleave", "drop"].forEach((type) => input.addEventListener(type, () => zone.classList.remove("is-drag")));

    remove.addEventListener("click", () => {
      reset();
      input.focus();
    });
  });
};
