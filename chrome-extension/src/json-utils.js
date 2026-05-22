export const SAMPLE_JSON = {
  product: "TomBag",
  feature: "JSON Viewer",
  enabled: true,
  version: 1,
  tags: ["format", "validate", "tree"],
  workspaces: [
    {
      id: "shire-bag-end",
      owner: { name: "Tom", team: "garden" },
      tools: ["json", "timestamp"],
      active: true,
    },
    {
      id: "green-dragon",
      owner: { name: "Merry", team: "kitchen" },
      tools: ["unit-converter"],
      active: false,
    },
    {
      id: "bywater-mill",
      owner: { name: "Sam", team: "garden" },
      tools: ["json", "unit-converter"],
      active: true,
    },
  ],
  options: {
    theme: "shire-workbench",
    compact: false,
    limits: {
      maxDepth: 32,
      maxItems: 10000,
    },
  },
};

export function parseJsonInput(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    return { ok: false, errorMessage: "请输入 JSON 内容。" };
  }

  const candidates = buildJsonParseCandidates(text);
  let firstError = null;

  for (const candidate of candidates) {
    try {
      const value = JSON.parse(candidate);
      return { ok: true, value: unwrapStringifiedJson(value) };
    } catch (error) {
      firstError ||= error;
    }
  }

  return {
    ok: false,
    errorMessage: formatJsonError(text, firstError || new Error("JSON 解析失败")),
  };
}

export function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

export function compressJson(value) {
  return JSON.stringify(value);
}

export function summarizeJson(value, locale = "zh") {
  if (Array.isArray(value)) {
    return locale === "en" ? `array, ${value.length} item(s)` : `数组，${value.length} 项`;
  }

  if (value && typeof value === "object") {
    const count = Object.keys(value).length;
    return locale === "en" ? `object, ${count} field(s)` : `对象，${count} 个字段`;
  }

  if (typeof value === "string") {
    return locale === "en" ? `string, ${value.length} character(s)` : `字符串，${value.length} 个字符`;
  }

  return describeJsonValue(value, locale);
}

export function findJsonListItem(value, matchKey, matchValue) {
  const result = filterJsonListItems(value, matchKey, matchValue, { mode: "exact" });
  return result.items.length ? result.matches[0] : null;
}

export function filterJsonListItems(value, matchKey, matchValue, options = {}) {
  const key = String(matchKey || "").trim();
  const target = normalizeMatchValue(matchValue);
  if (!key && !target) {
    return { items: [], matches: [] };
  }

  const mode = options.mode === "exact" ? "exact" : "contains";
  const matches = [];

  for (const arrayInfo of collectJsonArrays(value)) {
    arrayInfo.items.forEach((item, index) => {
      if (itemMatches(item, key, target, mode)) {
        matches.push({
          item,
          index,
          path: arrayInfo.path,
        });
      }
    });
  }

  return {
    items: matches.map((match) => match.item),
    matches,
  };
}

function collectJsonArrays(value, path = "$", arrays = [], seen = new Set()) {
  if (isComplex(value)) {
    if (seen.has(value)) {
      return arrays;
    }
    seen.add(value);
  }

  if (Array.isArray(value)) {
    arrays.push({ path, items: value });
    value.forEach((item, index) => {
      collectJsonArrays(item, `${path}[${index}]`, arrays, seen);
    });
    return arrays;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      collectJsonArrays(child, appendJsonPath(path, key), arrays, seen);
    });
    return arrays;
  }

  if (typeof value === "string") {
    const parsed = parseJsonInput(value);
    if (parsed.ok && isComplex(parsed.value)) {
      collectJsonArrays(parsed.value, `${path} (已解析)`, arrays, seen);
    }
  }

  return arrays;
}

function itemMatches(item, matchKey, normalizedValue, mode) {
  if (matchKey) {
    const directValue = getValueByDotPath(item, matchKey);
    if (directValue.found) {
      return normalizedValue ? valueMatches(directValue.value, normalizedValue, mode) : true;
    }

    const nestedValues = collectValuesByKey(item, matchKey);
    if (!normalizedValue) {
      return nestedValues.length > 0;
    }

    return nestedValues.some((value) => valueMatches(value, normalizedValue, mode));
  }

  return collectPrimitiveValues(item).some((value) => valueMatches(value, normalizedValue, mode));
}

function getValueByDotPath(value, path) {
  if (!path.includes(".")) {
    if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, path)) {
      return { found: true, value: value[path] };
    }
    return { found: false };
  }

  const segments = path.split(".").filter(Boolean);
  let current = value;
  for (const segment of segments) {
    if (!current || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, segment)) {
      return { found: false };
    }
    current = current[segment];
  }
  return { found: true, value: current };
}

function collectValuesByKey(value, key, values = []) {
  if (!isComplex(value)) {
    return values;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectValuesByKey(item, key, values));
    return values;
  }

  Object.entries(value).forEach(([childKey, child]) => {
    if (childKey === key) {
      values.push(child);
    }
    collectValuesByKey(child, key, values);
  });

  return values;
}

function collectPrimitiveValues(value, values = []) {
  if (!isComplex(value)) {
    values.push(value);
    return values;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPrimitiveValues(item, values));
    return values;
  }

  Object.values(value).forEach((child) => collectPrimitiveValues(child, values));
  return values;
}

function normalizeMatchValue(value) {
  const text = String(value ?? "").trim();
  if (!isWrappedByMatchingQuote(text)) {
    return text;
  }

  try {
    const parsed = JSON.parse(text);
    return isComplex(parsed) ? text : String(parsed).trim();
  } catch {
    return text;
  }
}

function valueMatches(value, normalizedValue, mode) {
  if (isComplex(value) || typeof value === "undefined") {
    return false;
  }

  const actual = String(value ?? "").trim();
  if (mode === "exact") {
    return actual === normalizedValue;
  }

  return actual.toLowerCase().includes(normalizedValue.toLowerCase());
}

function appendJsonPath(base, key) {
  if (/^[A-Za-z_$][\w$]*$/.test(key)) {
    return `${base}.${key}`;
  }
  return `${base}[${JSON.stringify(key)}]`;
}

function isComplex(value) {
  return typeof value === "object" && value !== null;
}

function buildJsonParseCandidates(raw) {
  const seen = new Set();
  const candidates = [];
  const pushCandidate = (value) => {
    if (typeof value !== "string") {
      return;
    }
    const text = value.trim();
    if (!text || seen.has(text)) {
      return;
    }
    seen.add(text);
    candidates.push(text);
  };

  pushCandidate(raw);

  const wrapped = isWrappedByMatchingQuote(raw);
  if (wrapped) {
    pushCandidate(raw.slice(1, -1));
  }

  if (raw.includes('\\"')) {
    pushCandidate(raw.replace(/\\"/g, '"'));
    if (wrapped) {
      pushCandidate(raw.slice(1, -1).replace(/\\"/g, '"'));
    }
  }

  return candidates;
}

function unwrapStringifiedJson(value) {
  let current = value;

  // 日志平台常会把 JSON 再包成字符串；最多拆三层，避免恶意长链输入卡住页面。
  for (let index = 0; index < 3; index += 1) {
    if (typeof current !== "string") {
      return current;
    }

    const trimmed = current.trim();
    if (!looksLikeJson(trimmed)) {
      return current;
    }

    try {
      current = JSON.parse(trimmed);
    } catch {
      return current;
    }
  }

  return current;
}

function formatJsonError(raw, error) {
  const message = error?.message || "JSON 解析失败";
  const position = extractErrorPosition(message);
  if (position === null) {
    return `JSON 解析失败：${message}`;
  }

  const { line, column } = getLineColumn(raw, position);
  return `JSON 解析失败：第 ${line} 行，第 ${column} 列。${message}`;
}

function extractErrorPosition(message) {
  const match = String(message).match(/position\s+(\d+)/i);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}

function getLineColumn(text, position) {
  const before = text.slice(0, position);
  const lines = before.split(/\n/);
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function isWrappedByMatchingQuote(text) {
  if (text.length < 2) {
    return false;
  }

  const first = text[0];
  const last = text[text.length - 1];
  return (first === '"' && last === '"') || (first === "'" && last === "'");
}

function looksLikeJson(text) {
  return (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]")) ||
    (text.startsWith('"') && text.endsWith('"'))
  );
}

function describeJsonValue(value, locale) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "boolean") {
    return locale === "en" ? `boolean ${value}` : value ? "布尔值 true" : "布尔值 false";
  }

  if (typeof value === "number") {
    return locale === "en" ? `number ${value}` : `数字 ${value}`;
  }

  return typeof value;
}
