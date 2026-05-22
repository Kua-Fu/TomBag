import {
  SAMPLE_JSON,
  compressJson,
  filterJsonListItems,
  findJsonListItem,
  formatJson,
  parseJsonInput,
  summarizeJson,
} from "./json-utils.js";
import { currentLocale, initAppShell, onLocaleChange, t } from "./app-shell.js";

const jsonInput = document.getElementById("jsonInput");
const statusText = document.getElementById("statusText");
const treeContainer = document.getElementById("treeContainer");
const prettyOutput = document.getElementById("prettyOutput");
const listMatchKey = document.getElementById("listMatchKey");
const listMatchValue = document.getElementById("listMatchValue");
const filterMode = document.getElementById("filterMode");
const fileInput = document.getElementById("fileInput");

document.getElementById("btnValidate").addEventListener("click", onValidate);
document.getElementById("btnFormat").addEventListener("click", onFormat);
document.getElementById("btnCompress").addEventListener("click", onCompress);
document.getElementById("btnCopy").addEventListener("click", onCopy);
document.getElementById("btnSample").addEventListener("click", onSample);
document.getElementById("btnClear").addEventListener("click", onClear);
document.getElementById("btnFilterList").addEventListener("click", onFilterList);
document.getElementById("btnExtractListItem").addEventListener("click", onExtractListItem);
document.getElementById("btnResetFilter").addEventListener("click", () => renderFromText(t("resetFilter")));
document.getElementById("btnExpandAll").addEventListener("click", () => setAllDetailsOpen(true));
document.getElementById("btnCollapseAll").addEventListener("click", () => setAllDetailsOpen(false));
fileInput.addEventListener("change", onFileChange);
jsonInput.addEventListener("input", () => {
  setStatus("neutral", t("jsonChanged"));
});
listMatchValue.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    onFilterList();
  }
});

let currentValue = null;
let hasRenderedValue = false;

initAppShell();
onSample();
onLocaleChange(() => {
  if (hasRenderedValue) {
    setStatus("ok", `${t("parseOk")}：${summarizeJson(currentValue, currentLocale())}`);
  }
});

function onSample() {
  jsonInput.value = formatJson(SAMPLE_JSON);
  listMatchKey.value = "owner.team";
  listMatchValue.value = "garden";
  filterMode.value = "exact";
  renderFromText(t("parseOk"));
}

function onClear() {
  jsonInput.value = "";
  listMatchKey.value = "";
  listMatchValue.value = "";
  filterMode.value = "contains";
  currentValue = null;
  hasRenderedValue = false;
  treeContainer.replaceChildren();
  prettyOutput.textContent = "";
  setStatus("neutral", t("cleared"));
}

function onValidate() {
  renderFromText(t("jsonValid"));
}

function onFormat() {
  const parsed = parseCurrent();
  if (!parsed.ok) {
    setStatus("error", parsed.errorMessage);
    return;
  }

  jsonInput.value = formatJson(parsed.value);
  renderJson(parsed.value);
  setStatus("ok", `${t("formatted")}：${summarizeJson(parsed.value, currentLocale())}`);
}

function onCompress() {
  const parsed = parseCurrent();
  if (!parsed.ok) {
    setStatus("error", parsed.errorMessage);
    return;
  }

  jsonInput.value = compressJson(parsed.value);
  renderJson(parsed.value);
  setStatus("ok", `${t("compressed")}：${summarizeJson(parsed.value, currentLocale())}`);
}

async function onCopy() {
  const value = hasRenderedValue ? currentValue : parseCurrent().value;
  if (value === undefined) {
    setStatus("error", parseCurrent().errorMessage);
    return;
  }

  try {
    await navigator.clipboard.writeText(formatJson(value));
    setStatus("ok", t("copiedJson"));
  } catch (error) {
    setStatus("error", `${t("copyFailed")}：${error.message}`);
  }
}

function onFilterList() {
  const parsed = parseCurrent();
  if (!parsed.ok) {
    setStatus("error", parsed.errorMessage);
    return;
  }

  if (!listMatchKey.value.trim() && !listMatchValue.value.trim()) {
    setStatus("error", t("filterMissing"));
    return;
  }

  const result = filterJsonListItems(parsed.value, listMatchKey.value, listMatchValue.value, {
    mode: filterMode.value,
  });

  if (!result.items.length) {
    setStatus("error", t("filterEmpty"));
    return;
  }

  renderJson(result.items);
  const paths = [...new Set(result.matches.map((match) => match.path))].join("、");
  setStatus("ok", t("filterFound", { count: result.items.length, paths }));
}

function onExtractListItem() {
  const parsed = parseCurrent();
  if (!parsed.ok) {
    setStatus("error", parsed.errorMessage);
    return;
  }

  const result = findJsonListItem(parsed.value, listMatchKey.value, listMatchValue.value);
  if (!result) {
    setStatus("error", t("locateEmpty"));
    return;
  }

  renderJson(result.item);
  setStatus("ok", t("locateFound", { path: result.path, index: result.index + 1 }));
}

async function onFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    jsonInput.value = await file.text();
    renderFromText(`${t("imported")} ${file.name}`);
  } catch (error) {
    setStatus("error", `${t("importFailed")}：${error.message}`);
  } finally {
    fileInput.value = "";
  }
}

function renderFromText(successPrefix) {
  const parsed = parseCurrent();
  if (!parsed.ok) {
    currentValue = null;
    hasRenderedValue = false;
    treeContainer.replaceChildren();
    prettyOutput.textContent = "";
    setStatus("error", parsed.errorMessage);
    return;
  }

  renderJson(parsed.value);
  setStatus("ok", `${successPrefix}：${summarizeJson(parsed.value, currentLocale())}`);
}

function parseCurrent() {
  return parseJsonInput(jsonInput.value);
}

function renderJson(value) {
  currentValue = value;
  hasRenderedValue = true;
  prettyOutput.textContent = formatJson(value);
  treeContainer.replaceChildren(createTreeNode("root", value, true));
}

function createTreeNode(key, value, root = false) {
  if (Array.isArray(value)) {
    return createBranch(key, `Array(${value.length})`, value.map((item, index) => [index, item]), root);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    return createBranch(key, `Object(${entries.length})`, entries, root);
  }

  const row = document.createElement("div");
  row.className = "tree-row";
  appendKey(row, key, root);
  appendPrimitive(row, value);
  return row;
}

function createBranch(key, label, entries, root) {
  const details = document.createElement("details");
  details.open = root || entries.length <= 12;

  const summary = document.createElement("summary");
  appendKey(summary, key, root);
  const type = document.createElement("span");
  type.textContent = label;
  type.className = "json-null";
  summary.append(type);
  details.append(summary);

  for (const [childKey, childValue] of entries) {
    details.append(createTreeNode(childKey, childValue));
  }

  return details;
}

function appendKey(target, key, root) {
  if (root) {
    return;
  }

  const keySpan = document.createElement("span");
  keySpan.className = "json-key";
  keySpan.textContent = `${key}: `;
  target.append(keySpan);
}

function appendPrimitive(target, value) {
  const valueSpan = document.createElement("span");

  if (typeof value === "string") {
    valueSpan.className = "json-string";
    valueSpan.textContent = JSON.stringify(value);
  } else if (typeof value === "number") {
    valueSpan.className = "json-number";
    valueSpan.textContent = String(value);
  } else if (typeof value === "boolean") {
    valueSpan.className = "json-boolean";
    valueSpan.textContent = String(value);
  } else {
    valueSpan.className = "json-null";
    valueSpan.textContent = String(value);
  }

  target.append(valueSpan);
}

function setAllDetailsOpen(open) {
  treeContainer.querySelectorAll("details").forEach((details) => {
    details.open = open;
  });
}

function setStatus(type, message) {
  statusText.className = `status ${type}`;
  statusText.textContent = message;
}
