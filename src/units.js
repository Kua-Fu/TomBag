export const CATEGORY_DEFS = [
  {
    id: "data-size",
    label: "数据大小",
    labelZh: "数据大小",
    labelEn: "Data Size",
    baseLabel: "B",
    baseLabelZh: "B",
    baseLabelEn: "B",
    units: [
      {
        id: "b",
        label: "b（比特）",
        labelZh: "b（比特）",
        labelEn: "b (bit)",
        symbolZh: "b",
        symbolEn: "b",
        factor: 0.125,
        family: "bit",
        aliases: ["bit", "bits", "比特"],
      },
      {
        id: "Kb",
        label: "Kb（千比特）",
        labelZh: "Kb（千比特）",
        labelEn: "kbit (kilobit, 10^3 bits)",
        symbolZh: "Kb",
        symbolEn: "kbit",
        factor: 125,
        family: "bit",
        aliases: ["kb", "kbit", "kilobit"],
      },
      {
        id: "Mb",
        label: "Mb（兆比特）",
        labelZh: "Mb（兆比特）",
        labelEn: "Mbit (megabit, 10^6 bits)",
        symbolZh: "Mb",
        symbolEn: "Mbit",
        factor: 125000,
        family: "bit",
        aliases: ["mb", "mbit", "megabit"],
      },
      {
        id: "Gb",
        label: "Gb（吉比特）",
        labelZh: "Gb（吉比特）",
        labelEn: "Gbit (gigabit, 10^9 bits)",
        symbolZh: "Gb",
        symbolEn: "Gbit",
        factor: 125000000,
        family: "bit",
        aliases: ["gb", "gbit", "gigabit"],
      },
      {
        id: "B",
        label: "B（字节）",
        labelZh: "B（字节）",
        labelEn: "B (byte)",
        symbolZh: "B",
        symbolEn: "B",
        factor: 1,
        family: "byte-decimal",
        aliases: ["byte", "bytes", "字节"],
      },
      {
        id: "KB",
        label: "KB（千字节）",
        labelZh: "KB（千字节）",
        labelEn: "kB (kilobyte, 10^3 bytes)",
        symbolZh: "KB",
        symbolEn: "kB",
        factor: 1000,
        family: "byte-decimal",
        aliases: ["kb", "kilobyte"],
      },
      {
        id: "MB",
        label: "MB（兆字节）",
        labelZh: "MB（兆字节）",
        labelEn: "MB (megabyte, 10^6 bytes)",
        symbolZh: "MB",
        symbolEn: "MB",
        factor: 1000000,
        family: "byte-decimal",
        aliases: ["megabyte"],
      },
      {
        id: "GB",
        label: "GB（吉字节）",
        labelZh: "GB（吉字节）",
        labelEn: "GB (gigabyte, 10^9 bytes)",
        symbolZh: "GB",
        symbolEn: "GB",
        factor: 1000000000,
        family: "byte-decimal",
        aliases: ["gigabyte"],
      },
      {
        id: "TB",
        label: "TB（太字节）",
        labelZh: "TB（太字节）",
        labelEn: "TB (terabyte, 10^12 bytes)",
        symbolZh: "TB",
        symbolEn: "TB",
        factor: 1000000000000,
        family: "byte-decimal",
        aliases: ["terabyte"],
      },
      {
        id: "KiB",
        label: "KiB（1024 字节）",
        labelZh: "KiB（1024 字节）",
        labelEn: "KiB (kibibyte, 2^10 bytes)",
        symbolZh: "KiB",
        symbolEn: "KiB",
        factor: 1024,
        family: "byte-binary",
        aliases: ["kibibyte"],
      },
      {
        id: "MiB",
        label: "MiB（1024 KiB）",
        labelZh: "MiB（1024 KiB）",
        labelEn: "MiB (mebibyte, 2^20 bytes)",
        symbolZh: "MiB",
        symbolEn: "MiB",
        factor: 1048576,
        family: "byte-binary",
        aliases: ["mebibyte"],
      },
      {
        id: "GiB",
        label: "GiB（1024 MiB）",
        labelZh: "GiB（1024 MiB）",
        labelEn: "GiB (gibibyte, 2^30 bytes)",
        symbolZh: "GiB",
        symbolEn: "GiB",
        factor: 1073741824,
        family: "byte-binary",
        aliases: ["gibibyte"],
      },
      {
        id: "TiB",
        label: "TiB（1024 GiB）",
        labelZh: "TiB（1024 GiB）",
        labelEn: "TiB (tebibyte, 2^40 bytes)",
        symbolZh: "TiB",
        symbolEn: "TiB",
        factor: 1099511627776,
        family: "byte-binary",
        aliases: ["tebibyte"],
      },
    ],
  },
  {
    id: "time-interval",
    label: "时间间隔",
    labelZh: "时间间隔",
    labelEn: "Time Interval",
    baseLabel: "s",
    baseLabelZh: "s",
    baseLabelEn: "s",
    units: [
      unit("ns", "纳秒（ns）", "ns (nanosecond)", 1e-9, ["nanosecond", "纳秒"]),
      unit("us", "微秒（us）", "us (microsecond)", 1e-6, ["μs", "µs", "microsecond", "微秒"]),
      unit("ms", "毫秒（ms）", "ms (millisecond)", 1e-3, ["millisecond", "毫秒"]),
      unit("s", "秒（s）", "s (second)", 1, ["sec", "second", "秒"]),
      unit("min", "分钟（min）", "min (minute)", 60, ["minute", "分钟", "分"]),
      unit("h", "小时（h）", "h (hour)", 3600, ["hour", "小时", "时"]),
      unit("d", "天（d）", "d (day)", 86400, ["day", "天"]),
      unit("week", "周（week）", "week", 604800, ["w", "周"]),
    ],
  },
  {
    id: "flow",
    label: "吞吐",
    labelZh: "吞吐",
    labelEn: "Throughput",
    baseLabel: "B/s",
    baseLabelZh: "B/s",
    baseLabelEn: "B/s",
    units: [
      unit("B/s", "B/s（字节每秒）", "B/s (bytes per second)", 1, ["byte/s", "bytes/s", "Bps"]),
      unit("KB/s", "KB/s（千字节每秒）", "kB/s (kilobytes per second)", 1000, ["kB/s"], "KB/s", "kB/s"),
      unit("MB/s", "MB/s（兆字节每秒）", "MB/s (megabytes per second)", 1000000, ["mB/s"]),
      unit("GB/s", "GB/s（吉字节每秒）", "GB/s (gigabytes per second)", 1000000000, ["gB/s"]),
      unit("TB/s", "TB/s（太字节每秒）", "TB/s (terabytes per second)", 1000000000000, ["tB/s"]),
    ],
  },
  {
    id: "bandwidth",
    label: "带宽",
    labelZh: "带宽",
    labelEn: "Bandwidth",
    baseLabel: "bps",
    baseLabelZh: "bps",
    baseLabelEn: "bit/s",
    units: [
      unit("bps", "bps（比特每秒）", "bit/s (bits per second)", 1, ["bit/s", "bits/s"], "bps", "bit/s"),
      unit("Kbps", "Kbps（千比特每秒）", "kbit/s (kilobits per second)", 1000, ["kbps"], "Kbps", "kbit/s"),
      unit("Mbps", "Mbps（兆比特每秒）", "Mbit/s (megabits per second)", 1000000, [], "Mbps", "Mbit/s"),
      unit("Gbps", "Gbps（吉比特每秒）", "Gbit/s (gigabits per second)", 1000000000, [], "Gbps", "Gbit/s"),
      unit("Tbps", "Tbps（太比特每秒）", "Tbit/s (terabits per second)", 1000000000000, [], "Tbps", "Tbit/s"),
    ],
  },
  {
    id: "percent",
    label: "百分比",
    labelZh: "百分比",
    labelEn: "Percentage",
    baseLabel: "ratio",
    baseLabelZh: "ratio",
    baseLabelEn: "ratio",
    units: [
      unit("ratio", "比例值（1 = 100%）", "ratio (1 = 100%)", 1, ["比例", "ratio"]),
      unit("%", "百分比（%）", "percent (%)", 0.01, ["percent", "pct", "百分比"]),
      unit("permille", "千分比（‰）", "per mille (‰)", 0.001, ["‰", "千分比"], "‰", "‰"),
      unit("ppm", "百万分比（ppm）", "parts per million (ppm)", 0.000001),
      unit("bp", "基点（bp）", "basis point (bp)", 0.0001, ["basispoint", "基点"]),
    ],
  },
  {
    id: "cny",
    label: "人民币",
    labelZh: "人民币",
    labelEn: "Chinese Yuan",
    baseLabel: "元",
    baseLabelZh: "元",
    baseLabelEn: "CNY",
    units: [
      unit("li", "厘", "li (0.001 CNY)", 0.001, ["厘"]),
      unit("fen", "分", "fen (0.01 CNY)", 0.01, ["分", "cent"]),
      unit("jiao", "角", "jiao (0.1 CNY)", 0.1, ["角"]),
      unit("yuan", "元", "yuan (CNY)", 1, ["rmb", "cny", "元"], "元", "CNY"),
      unit("wanyuan", "万元", "ten thousand yuan", 10000, ["万元"], "万元", "10k CNY"),
      unit("yi", "亿元", "hundred million yuan", 100000000, ["亿元"], "亿元", "100M CNY"),
    ],
  },
];

export function getCategoryById(categoryId) {
  return CATEGORY_DEFS.find((category) => category.id === categoryId) || CATEGORY_DEFS[0];
}

export function categoryLabel(category, locale = "zh") {
  return locale === "en" ? category.labelEn || category.label : category.labelZh || category.label;
}

export function baseUnitLabel(category, locale = "zh") {
  return locale === "en" ? category.baseLabelEn || category.baseLabel : category.baseLabelZh || category.baseLabel;
}

export function findUnit(category, unitId) {
  return category.units.find((item) => item.id === unitId) || null;
}

export function unitLabel(item, locale = "zh") {
  return locale === "en" ? item.labelEn || item.label : item.labelZh || item.label;
}

export function unitSymbol(item, locale = "zh") {
  if (!item) {
    return "";
  }
  if (locale === "en") {
    return item.symbolEn || item.display || item.id || "";
  }
  return item.symbolZh || item.display || item.id || "";
}

export function parseMeasurement(raw, category, preferredFamily) {
  const text = String(raw || "").trim();
  if (!text) {
    return { value: null, matchedUnitId: null, rawToken: "" };
  }

  const compact = text.replace(/,/g, "");
  const match = compact.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)\s*([a-zA-Z%/_\-.µμ‰\u4e00-\u9fa5]*)$/);
  if (!match) {
    return { value: null, matchedUnitId: null, rawToken: "" };
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value)) {
    return { value: null, matchedUnitId: null, rawToken: "" };
  }

  const rawToken = (match[2] || "").trim();
  if (!rawToken) {
    return { value, matchedUnitId: null, rawToken: "" };
  }

  return {
    value,
    matchedUnitId: findUnitIdByToken(category, rawToken, preferredFamily),
    rawToken,
  };
}

export function convertUnit({ categoryId, value, fromUnitId, toUnitId }) {
  const category = getCategoryById(categoryId);
  const fromUnit = findUnit(category, fromUnitId);
  const toUnit = findUnit(category, toUnitId);

  if (!fromUnit || !toUnit) {
    return { ok: false, error: "invalid-unit" };
  }

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid-value" };
  }

  const baseValue = value * fromUnit.factor;
  const convertedValue = baseValue / toUnit.factor;
  const smartUnit = chooseBestUnit(baseValue, getSmartCandidates(category, fromUnit), toUnit);
  const smartValue = smartUnit ? baseValue / smartUnit.factor : convertedValue;

  return {
    ok: true,
    category,
    fromUnit,
    toUnit,
    value,
    baseValue,
    convertedValue,
    smartUnit,
    smartValue,
  };
}

export function formatNumber(value, options = {}) {
  const { maxFractionDigits = 12, useGrouping = false, locale = "en-US" } = options;
  if (!Number.isFinite(value)) {
    return "--";
  }

  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e21 || abs < 1e-12)) {
    return value.toExponential(12).replace(/\.0+e/, "e").replace(/(\.\d*?)0+e/, "$1e");
  }

  return value
    .toLocaleString(locale, {
      maximumFractionDigits: maxFractionDigits,
      useGrouping,
    })
    .replace(/\.(\d*?[1-9])0+$/, ".$1")
    .replace(/\.0+$/, "")
    .replace(/^-0$/, "0");
}

function unit(id, labelZh, labelEn, factor, aliases = [], symbolZh = id, symbolEn = id) {
  return {
    id,
    label: labelZh,
    labelZh,
    labelEn,
    symbolZh,
    symbolEn,
    factor,
    aliases,
  };
}

function findUnitIdByToken(category, rawToken, preferredFamily) {
  const token = String(rawToken || "").trim();
  if (!token) {
    return null;
  }

  const exactId = category.units.find((item) => item.id === token);
  if (exactId) {
    return exactId.id;
  }

  const normalizedToken = normalizeToken(token);
  const candidates = category.units.filter((item) => {
    if (normalizeToken(item.id) === normalizedToken) {
      return true;
    }
    if (normalizeToken(item.symbolEn) === normalizedToken || normalizeToken(item.symbolZh) === normalizedToken) {
      return true;
    }
    return (item.aliases || []).some((alias) => normalizeToken(alias) === normalizedToken);
  });

  if (candidates.length === 1) {
    return candidates[0].id;
  }

  if (candidates.length > 1 && preferredFamily) {
    const familyMatch = candidates.find((item) => item.family === preferredFamily);
    if (familyMatch) {
      return familyMatch.id;
    }
  }

  return candidates[0]?.id || null;
}

function normalizeToken(token) {
  return String(token || "")
    .trim()
    .replace(/µ/g, "u")
    .replace(/μ/g, "u")
    .toLowerCase();
}

function getSmartCandidates(category, fromUnit) {
  if (category.id === "data-size" && fromUnit.family) {
    return category.units.filter((item) => item.family === fromUnit.family);
  }

  return category.units;
}

function chooseBestUnit(baseValue, candidates, fallbackUnit) {
  const sorted = [...candidates].sort((a, b) => a.factor - b.factor);
  if (!sorted.length) {
    return fallbackUnit || null;
  }

  const absBase = Math.abs(baseValue);
  if (absBase === 0) {
    return fallbackUnit || sorted[0];
  }

  let best = sorted[0];
  for (const item of sorted) {
    const value = absBase / item.factor;
    if (value >= 1) {
      best = item;
    }
    if (value < 1000) {
      break;
    }
  }

  return best;
}
