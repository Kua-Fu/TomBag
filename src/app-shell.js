const STORAGE_KEYS = {
  locale: "tombag.locale",
  backgroundEnabled: "tombag.background.enabled",
  backgroundImage: "tombag.background.image",
};

const DEFAULT_LOCALE = "zh";
const DEFAULT_BACKGROUND = "/assets/background.png";

const TRANSLATIONS = {
  zh: {
    appSubtitle: "日常开发工具",
    navJson: "JSON 展示",
    navTimestamp: "时间戳转换",
    navUnit: "单位换算",
    language: "语言",
    background: "背景",
    customBackground: "自定义背景",
    backgroundOn: "开",
    backgroundOff: "关",
    jsonTitle: "JSON 输入",
    jsonToolbar: "JSON 操作",
    validate: "校验",
    format: "格式化",
    compress: "压缩",
    copy: "复制",
    sample: "示例",
    clear: "清空",
    importFile: "导入文件",
    treeView: "树形视图",
    expand: "展开",
    collapse: "收起",
    filterField: "筛选字段",
    filterValue: "筛选值",
    filterMode: "方式",
    contains: "包含",
    exact: "精确",
    filter: "筛选",
    locate: "定位",
    reset: "重置",
    prettyOutput: "格式化输出",
    jsonFieldPlaceholder: "id / owner.team / active",
    jsonValuePlaceholder: "支持列表对象里的任意值",
    timestampNow: "当前时间戳",
    switchUnit: "切换单位",
    stop: "停止",
    start: "启动",
    timestampToDate: "时间戳转日期",
    dateToTimestamp: "日期转时间戳",
    timestamp: "时间戳",
    unit: "单位",
    timezone: "时区",
    convert: "转换",
    copyResult: "复制结果",
    dateTime: "日期时间",
    outputUnit: "输出单位",
    unitConverter: "单位换算",
    category: "分类",
    value: "数值",
    from: "从",
    to: "到",
    swap: "交换",
    startConvert: "开始换算",
    presets: "常用",
    autoConvertHint: "输入数值后会自动换算。",
    converted: "换算完成。",
    copied: "已复制",
    copyFailed: "复制失败",
    invalidJsonInput: "请输入 JSON 内容。",
    jsonChanged: "内容已变更，点击校验或格式化查看结果。",
    cleared: "已清空。",
    jsonValid: "JSON 校验通过",
    formatted: "格式化成功",
    compressed: "压缩成功",
    copiedJson: "已复制格式化 JSON。",
    importFailed: "读取文件失败",
    imported: "已导入",
    resetFilter: "已重置筛选",
    filterMissing: "请输入筛选字段或筛选值。",
    filterEmpty: "没有筛选到匹配的列表项。",
    filterFound: "筛选到 {count} 项：{paths}",
    locateEmpty: "没有找到匹配的列表项。",
    locateFound: "已定位 {path} 中的第 {index} 项。",
    parseOk: "解析成功",
    invalidTimestamp: "无效的时间戳。",
    invalidDate: "请输入 YYYY-MM-DD HH:mm:ss 格式的日期时间。",
    invalidUnit: "请选择有效单位。",
    invalidValue: "请输入有效数值。",
    unknownUnit: "无法识别单位：{unit}",
    smartDisplay: "智能展示",
    presetData: "数据 28TB",
    presetGb: "1.5GB",
    presetMinutes: "90分钟",
    presetPercent: "12.5%",
    presetCny: "16888分",
  },
  en: {
    appSubtitle: "Daily Dev Tools",
    navJson: "JSON Viewer",
    navTimestamp: "Timestamp",
    navUnit: "Unit Converter",
    language: "Language",
    background: "Background",
    customBackground: "Custom",
    backgroundOn: "On",
    backgroundOff: "Off",
    jsonTitle: "JSON Input",
    jsonToolbar: "JSON Actions",
    validate: "Validate",
    format: "Format",
    compress: "Minify",
    copy: "Copy",
    sample: "Sample",
    clear: "Clear",
    importFile: "Import",
    treeView: "Tree View",
    expand: "Expand",
    collapse: "Collapse",
    filterField: "Filter Field",
    filterValue: "Filter Value",
    filterMode: "Mode",
    contains: "Contains",
    exact: "Exact",
    filter: "Filter",
    locate: "Locate",
    reset: "Reset",
    prettyOutput: "Formatted Output",
    jsonFieldPlaceholder: "id / owner.team / active",
    jsonValuePlaceholder: "Match any value inside list items",
    timestampNow: "Current Timestamp",
    switchUnit: "Switch Unit",
    stop: "Stop",
    start: "Start",
    timestampToDate: "Timestamp to Date",
    dateToTimestamp: "Date to Timestamp",
    timestamp: "Timestamp",
    unit: "Unit",
    timezone: "Time Zone",
    convert: "Convert",
    copyResult: "Copy Result",
    dateTime: "Date Time",
    outputUnit: "Output Unit",
    unitConverter: "Unit Converter",
    category: "Category",
    value: "Value",
    from: "From",
    to: "To",
    swap: "Swap",
    startConvert: "Convert",
    presets: "Presets",
    autoConvertHint: "Conversion runs automatically as you type.",
    converted: "Converted.",
    copied: "Copied",
    copyFailed: "Copy failed",
    invalidJsonInput: "Enter JSON content.",
    jsonChanged: "Content changed. Validate or format to refresh results.",
    cleared: "Cleared.",
    jsonValid: "JSON is valid",
    formatted: "Formatted",
    compressed: "Minified",
    copiedJson: "Formatted JSON copied.",
    importFailed: "Failed to read file",
    imported: "Imported",
    resetFilter: "Filter reset",
    filterMissing: "Enter a filter field or value.",
    filterEmpty: "No matching list items.",
    filterFound: "Found {count} item(s): {paths}",
    locateEmpty: "No matching list item.",
    locateFound: "Located item {index} in {path}.",
    parseOk: "Parsed",
    invalidTimestamp: "Invalid timestamp.",
    invalidDate: "Use YYYY-MM-DD HH:mm:ss.",
    invalidUnit: "Select valid units.",
    invalidValue: "Enter a valid number.",
    unknownUnit: "Unknown unit: {unit}",
    smartDisplay: "Readable",
    presetData: "Data 28 TB",
    presetGb: "1.5 GB",
    presetMinutes: "90 min",
    presetPercent: "12.5%",
    presetCny: "CNY 168.88",
  },
};

let initialized = false;
let localeListeners = new Set();

export function initAppShell() {
  if (initialized) {
    return;
  }
  initialized = true;

  applyBackground();
  translatePage();
  bindLocaleSelect();
  bindBackgroundToggle();
  bindBackgroundFile();
}

export function currentLocale() {
  const stored = localStorage.getItem(STORAGE_KEYS.locale);
  return stored === "en" ? "en" : DEFAULT_LOCALE;
}

export function t(key, params = {}) {
  const locale = currentLocale();
  const template = TRANSLATIONS[locale]?.[key] || TRANSLATIONS.en[key] || key;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

export function onLocaleChange(listener) {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
}

export function translatePage() {
  const locale = currentLocale();
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });

  document.querySelectorAll("[data-setting='locale']").forEach((select) => {
    select.value = locale;
  });

  document.querySelectorAll("[data-setting='background']").forEach((checkbox) => {
    checkbox.checked = isBackgroundEnabled();
  });
}

function bindLocaleSelect() {
  document.querySelectorAll("[data-setting='locale']").forEach((select) => {
    select.addEventListener("change", () => {
      localStorage.setItem(STORAGE_KEYS.locale, select.value === "en" ? "en" : "zh");
      translatePage();
      localeListeners.forEach((listener) => listener(currentLocale()));
    });
  });
}

function bindBackgroundToggle() {
  document.querySelectorAll("[data-setting='background']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      localStorage.setItem(STORAGE_KEYS.backgroundEnabled, checkbox.checked ? "1" : "0");
      applyBackground();
      translatePage();
    });
  });
}

function bindBackgroundFile() {
  document.querySelectorAll("[data-setting='backgroundFile']").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      const dataUrl = await readFileAsDataUrl(file);
      localStorage.setItem(STORAGE_KEYS.backgroundImage, dataUrl);
      localStorage.setItem(STORAGE_KEYS.backgroundEnabled, "1");
      input.value = "";
      applyBackground();
      translatePage();
    });
  });
}

function applyBackground() {
  document.body.classList.toggle("no-background", !isBackgroundEnabled());
  const image = localStorage.getItem(STORAGE_KEYS.backgroundImage) || DEFAULT_BACKGROUND;
  document.documentElement.style.setProperty("--app-background-image", `url("${image}")`);
}

function isBackgroundEnabled() {
  return localStorage.getItem(STORAGE_KEYS.backgroundEnabled) !== "0";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}
