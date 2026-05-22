import { currentLocale, initAppShell, onLocaleChange, t } from "./app-shell.js";
import {
  CATEGORY_DEFS,
  baseUnitLabel,
  categoryLabel,
  convertUnit,
  findUnit,
  formatNumber,
  getCategoryById,
  parseMeasurement,
  unitLabel,
  unitSymbol,
} from "./units.js";

const categorySelect = document.getElementById("categorySelect");
const valueInput = document.getElementById("valueInput");
const fromUnitSelect = document.getElementById("fromUnitSelect");
const toUnitSelect = document.getElementById("toUnitSelect");
const swapBtn = document.getElementById("swapBtn");
const convertBtn = document.getElementById("convertBtn");
const copyResultBtn = document.getElementById("copyResultBtn");
const sampleBtn = document.getElementById("sampleBtn");
const hintText = document.getElementById("hintText");
const resultText = document.getElementById("resultText");
const formulaText = document.getElementById("formulaText");
const smartResultText = document.getElementById("smartResultText");
const presetList = document.getElementById("presetList");

const PRESETS = [
  {
    label: "presetData",
    categoryId: "data-size",
    value: "28717740816392 byte",
    fromUnitId: "B",
    toUnitId: "TiB",
  },
  {
    label: "presetGb",
    categoryId: "data-size",
    value: "1.5 GB",
    fromUnitId: "GB",
    toUnitId: "MiB",
  },
  {
    label: "presetMinutes",
    categoryId: "time-interval",
    value: "90 min",
    fromUnitId: "min",
    toUnitId: "h",
  },
  {
    label: "presetPercent",
    categoryId: "percent",
    value: "12.5 %",
    fromUnitId: "%",
    toUnitId: "ratio",
  },
  {
    label: "presetCny",
    categoryId: "cny",
    value: "16888 fen",
    fromUnitId: "fen",
    toUnitId: "yuan",
  },
];

let lastDisplayedResult = "";

initAppShell();
renderCategoryOptions();
renderUnitOptions();
renderPresets();
setSample();
convert();

categorySelect.addEventListener("change", () => {
  renderUnitOptions();
  convert();
});
valueInput.addEventListener("input", convert);
fromUnitSelect.addEventListener("change", convert);
toUnitSelect.addEventListener("change", convert);
convertBtn.addEventListener("click", convert);
sampleBtn.addEventListener("click", () => {
  setSample();
  convert();
});
swapBtn.addEventListener("click", () => {
  const from = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = from;
  convert();
});
copyResultBtn.addEventListener("click", copyResult);
onLocaleChange(() => {
  renderCategoryOptions();
  renderUnitOptions();
  renderPresets();
  convert();
});

function renderPresets() {
  presetList.replaceChildren(
    ...PRESETS.map((preset, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-chip";
      button.textContent = t(preset.label);
      button.addEventListener("click", () => applyPreset(index));
      return button;
    })
  );
}

function renderCategoryOptions() {
  const selected = categorySelect.value || CATEGORY_DEFS[0]?.id;
  const locale = currentLocale();
  categorySelect.replaceChildren(
    ...CATEGORY_DEFS.map((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = categoryLabel(category, locale);
      return option;
    })
  );
  categorySelect.value = getCategoryById(selected).id;
}

function renderUnitOptions() {
  const category = getCategoryById(categorySelect.value);
  const locale = currentLocale();
  const previousFrom = fromUnitSelect.value;
  const previousTo = toUnitSelect.value;
  const options = category.units.map((unit) => {
    const option = document.createElement("option");
    option.value = unit.id;
    option.textContent = unitLabel(unit, locale);
    return option;
  });

  fromUnitSelect.replaceChildren(...options.map((option) => option.cloneNode(true)));
  toUnitSelect.replaceChildren(...options);

  fromUnitSelect.value = findUnit(category, previousFrom)?.id || category.units[0]?.id || "";
  toUnitSelect.value = findUnit(category, previousTo)?.id || category.units[1]?.id || category.units[0]?.id || "";
  setHint(t("autoConvertHint"));
}

function setSample() {
  applyPreset(0, false);
}

function applyPreset(index, shouldConvert = true) {
  const preset = PRESETS[index] || PRESETS[0];
  categorySelect.value = preset.categoryId;
  renderUnitOptions();
  valueInput.value = preset.value;
  fromUnitSelect.value = preset.fromUnitId;
  toUnitSelect.value = preset.toUnitId;
  if (shouldConvert) {
    convert();
  }
}

function convert() {
  const category = getCategoryById(categorySelect.value);
  const currentFromUnit = findUnit(category, fromUnitSelect.value);
  const parsed = parseMeasurement(valueInput.value, category, currentFromUnit?.family);

  if (parsed.rawToken && !parsed.matchedUnitId) {
    setError(t("unknownUnit", { unit: parsed.rawToken }));
    clearResults();
    return;
  }

  if (parsed.matchedUnitId) {
    fromUnitSelect.value = parsed.matchedUnitId;
  }

  if (parsed.value === null) {
    setError(t("invalidValue"));
    clearResults();
    return;
  }

  const result = convertUnit({
    categoryId: category.id,
    value: parsed.value,
    fromUnitId: fromUnitSelect.value,
    toUnitId: toUnitSelect.value,
  });

  if (!result.ok) {
    setError(result.error === "invalid-unit" ? t("invalidUnit") : t("invalidValue"));
    clearResults();
    return;
  }

  renderResult(result);
}

function renderResult(result) {
  const locale = currentLocale();
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";
  const converted = `${formatNumber(result.convertedValue, {
    maxFractionDigits: 15,
    useGrouping: true,
    locale: numberLocale,
  })} ${unitSymbol(result.toUnit, locale)}`;
  const smart = `${formatNumber(result.smartValue, {
    maxFractionDigits: 8,
    useGrouping: true,
    locale: numberLocale,
  })} ${unitSymbol(result.smartUnit, locale)}`;

  resultText.textContent = converted;
  smartResultText.textContent = `${t("smartDisplay")}：${smart}`;
  formulaText.textContent = `${formatNumber(result.value, { locale: numberLocale })} ${unitSymbol(
    result.fromUnit,
    locale
  )} = ${formatNumber(result.baseValue, {
    maxFractionDigits: 15,
    locale: numberLocale,
  })} ${baseUnitLabel(result.category, locale)} = ${converted}`;
  lastDisplayedResult = converted;
  setHint(t("converted"));
}

function clearResults() {
  resultText.textContent = "";
  smartResultText.textContent = "";
  formulaText.textContent = "";
  lastDisplayedResult = "";
}

function setHint(message) {
  hintText.textContent = message;
  hintText.classList.remove("error");
}

function setError(message) {
  hintText.textContent = message;
  hintText.classList.add("error");
}

async function copyResult() {
  if (!lastDisplayedResult) {
    return;
  }

  const originalText = copyResultBtn.textContent;
  try {
    await navigator.clipboard.writeText(lastDisplayedResult);
    copyResultBtn.textContent = t("copied");
  } catch {
    copyResultBtn.textContent = t("copyFailed");
  }

  setTimeout(() => {
    copyResultBtn.textContent = originalText;
  }, 1200);
}
