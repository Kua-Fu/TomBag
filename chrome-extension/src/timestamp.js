import {
  TIME_ZONES,
  TIMESTAMP_UNITS,
  convertDateToTimestamp,
  convertTimestampToDate,
  currentTimestamp,
  formatInTimeZone,
} from "./time-utils.js";
import { currentLocale, initAppShell, onLocaleChange, t } from "./app-shell.js";

const currentTsEl = document.getElementById("currentTs");
const currentUnitLabelEl = document.getElementById("currentUnitLabel");
const toggleUnitBtn = document.getElementById("toggleUnitBtn");
const copyNowBtn = document.getElementById("copyNowBtn");
const toggleRunBtn = document.getElementById("toggleRunBtn");
const tsInput = document.getElementById("tsInput");
const tsUnitSelect = document.getElementById("tsUnitSelect");
const tzSelect = document.getElementById("tzSelect");
const tsToDateBtn = document.getElementById("tsToDateBtn");
const dateOutput = document.getElementById("dateOutput");
const copyDateBtn = document.getElementById("copyDateBtn");
const dateInput = document.getElementById("dateInput");
const tzSelect2 = document.getElementById("tzSelect2");
const tsOutput = document.getElementById("tsOutput");
const tsOutUnitSelect = document.getElementById("tsOutUnitSelect");
const dateToTsBtn = document.getElementById("dateToTsBtn");
const copyTsBtn = document.getElementById("copyTsBtn");

let unitIndex = 0;
let timerId = null;
let ticking = true;

initAppShell();
renderTimestampUnitOptions(tsUnitSelect, "s");
renderTimestampUnitOptions(tsOutUnitSelect, "s");
renderTimeZoneOptions(tzSelect);
renderTimeZoneOptions(tzSelect2);
setDefaults();
renderCurrent();
startTicking();
onLocaleChange(() => {
  renderTimestampUnitOptions(tsUnitSelect, tsUnitSelect.value);
  renderTimestampUnitOptions(tsOutUnitSelect, tsOutUnitSelect.value);
  renderCurrent();
  convertTsToDate();
  convertDateToTs();
  renderRunButton();
});

toggleUnitBtn.addEventListener("click", () => {
  unitIndex = (unitIndex + 1) % TIMESTAMP_UNITS.length;
  renderCurrent();
});

copyNowBtn.addEventListener("click", () => copyText(currentTsEl.textContent, copyNowBtn));
toggleRunBtn.addEventListener("click", () => {
  if (ticking) {
    stopTicking();
  } else {
    startTicking();
  }
});

tsToDateBtn.addEventListener("click", convertTsToDate);
dateToTsBtn.addEventListener("click", convertDateToTs);
copyDateBtn.addEventListener("click", () => copyText(dateOutput.textContent, copyDateBtn));
copyTsBtn.addEventListener("click", () => copyText(tsOutput.textContent, copyTsBtn));
tsInput.addEventListener("keydown", runOnEnter(convertTsToDate));
dateInput.addEventListener("keydown", runOnEnter(convertDateToTs));
tsUnitSelect.addEventListener("change", convertTsToDate);
tzSelect.addEventListener("change", convertTsToDate);
tzSelect2.addEventListener("change", convertDateToTs);
tsOutUnitSelect.addEventListener("change", convertDateToTs);

function renderTimeZoneOptions(select) {
  select.replaceChildren(
    ...TIME_ZONES.map((timeZone) => {
      const option = document.createElement("option");
      option.value = timeZone;
      option.textContent = timeZone;
      return option;
    })
  );
}

function renderTimestampUnitOptions(select, selectedValue) {
  const locale = currentLocale();
  select.replaceChildren(
    ...TIMESTAMP_UNITS.map((unit) => {
      const option = document.createElement("option");
      option.value = unit.id;
      option.textContent = locale === "en" ? unit.labelEn : unit.labelZh;
      return option;
    })
  );
  select.value = selectedValue;
}

function setDefaults() {
  const now = Date.now();
  const defaultZone = TIME_ZONES.includes("Asia/Shanghai") ? "Asia/Shanghai" : TIME_ZONES[0];
  tsUnitSelect.value = "s";
  tsOutUnitSelect.value = "s";
  tzSelect.value = defaultZone;
  tzSelect2.value = defaultZone;
  tsInput.value = Math.floor(now / 1000).toString();
  dateInput.value = formatInTimeZone(now, defaultZone);
  convertTsToDate();
  convertDateToTs();
}

function renderCurrent() {
  const unit = TIMESTAMP_UNITS[unitIndex];
  currentTsEl.textContent = currentTimestamp(unit.id);
  currentUnitLabelEl.textContent = currentLocale() === "en" ? unit.shortEn : unit.shortZh;
}

function startTicking() {
  clearInterval(timerId);
  timerId = setInterval(renderCurrent, 200);
  ticking = true;
  toggleRunBtn.classList.remove("is-paused");
  renderRunButton();
}

function stopTicking() {
  clearInterval(timerId);
  timerId = null;
  ticking = false;
  toggleRunBtn.classList.add("is-paused");
  renderRunButton();
}

function renderRunButton() {
  toggleRunBtn.textContent = ticking ? t("stop") : t("start");
}

function convertTsToDate() {
  const result = convertTimestampToDate(tsInput.value, tsUnitSelect.value, tzSelect.value);
  dateOutput.textContent = result.ok ? result.value : t(result.error);
  dateOutput.classList.toggle("error", !result.ok);
}

function convertDateToTs() {
  const result = convertDateToTimestamp(dateInput.value, tzSelect2.value, tsOutUnitSelect.value);
  tsOutput.textContent = result.ok ? result.value : t(result.error);
  tsOutput.classList.toggle("error", !result.ok);
}

async function copyText(text, button) {
  if (!text) {
    return;
  }

  const originalText = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = t("copied");
  } catch {
    button.textContent = t("copyFailed");
  }

  setTimeout(() => {
    button.textContent = originalText;
  }, 1200);
}

function runOnEnter(callback) {
  return (event) => {
    if (event.key === "Enter") {
      callback();
    }
  };
}
