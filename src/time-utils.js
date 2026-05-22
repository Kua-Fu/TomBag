export const TIMESTAMP_UNITS = [
  { id: "s", label: "秒", labelZh: "秒", labelEn: "second (s)", shortZh: "秒", shortEn: "s", multiplier: 1000 },
  { id: "ms", label: "毫秒", labelZh: "毫秒", labelEn: "millisecond (ms)", shortZh: "毫秒", shortEn: "ms", multiplier: 1 },
  { id: "us", label: "微秒", labelZh: "微秒", labelEn: "microsecond (us)", shortZh: "微秒", shortEn: "us", multiplier: 0.001 },
  { id: "ns", label: "纳秒", labelZh: "纳秒", labelEn: "nanosecond (ns)", shortZh: "纳秒", shortEn: "ns", multiplier: 0.000001 },
];

export const TIME_ZONES = [
  "Asia/Shanghai",
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export function toMilliseconds(value, unit) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  try {
    if (unit === "ns") {
      return Number(BigInt(text) / 1_000_000n);
    }
    if (unit === "us") {
      return Number(BigInt(text) / 1_000n);
    }
  } catch {
    return null;
  }

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  if (unit === "s") {
    return numeric * 1000;
  }

  if (unit === "ms") {
    return numeric;
  }

  return null;
}

export function fromMilliseconds(ms, unit) {
  if (!Number.isFinite(ms)) {
    return "";
  }

  if (unit === "ns") {
    return (BigInt(Math.trunc(ms)) * 1_000_000n).toString();
  }

  if (unit === "us") {
    return (BigInt(Math.trunc(ms)) * 1_000n).toString();
  }

  if (unit === "s") {
    return formatDecimal(ms / 1000, 3);
  }

  return String(Math.trunc(ms));
}

export function convertTimestampToDate(value, unit, timeZone) {
  const ms = toMilliseconds(value, unit);
  if (ms === null || !Number.isFinite(ms)) {
    return { ok: false, error: "invalidTimestamp" };
  }

  try {
    return { ok: true, value: formatInTimeZone(ms, timeZone), ms };
  } catch (error) {
    return { ok: false, error: error.message || "invalidTimestamp" };
  }
}

export function convertDateToTimestamp(value, timeZone, unit) {
  const parts = parseDateTimeParts(value);
  if (!parts) {
    return { ok: false, error: "invalidDate" };
  }

  try {
    const ms = zonedTimeToUtc(parts, timeZone);
    return { ok: true, value: fromMilliseconds(ms, unit), ms };
  } catch (error) {
    return { ok: false, error: error.message || "invalidDate" };
  }
}

export function formatInTimeZone(ms, timeZone) {
  const parts = getTimeZoneParts(ms, timeZone);
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function currentTimestamp(unit) {
  return fromMilliseconds(Date.now(), unit);
}

export function parseDateTimeParts(value) {
  const text = String(value || "").trim();
  const match = text.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?)?$/
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };

  if (
    parts.month < 1 ||
    parts.month > 12 ||
    parts.day < 1 ||
    parts.day > 31 ||
    parts.hour < 0 ||
    parts.hour > 23 ||
    parts.minute < 0 ||
    parts.minute > 59 ||
    parts.second < 0 ||
    parts.second > 59
  ) {
    return null;
  }

  return parts;
}

function zonedTimeToUtc(parts, timeZone) {
  const wallClockAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  let offset = getTimeZoneOffsetMs(timeZone, wallClockAsUtc);
  let utc = wallClockAsUtc - offset;

  // 夏令时切换边界附近需要再算一次偏移，避免落在前一个 offset 上。
  offset = getTimeZoneOffsetMs(timeZone, utc);
  utc = wallClockAsUtc - offset;

  return utc;
}

function getTimeZoneOffsetMs(timeZone, timestampMs) {
  const parts = getTimeZoneParts(timestampMs, timeZone);
  const localAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return localAsUtc - timestampMs;
}

function getTimeZoneParts(ms, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const entries = formatter.formatToParts(new Date(ms)).map((part) => [part.type, part.value]);
  const parts = Object.fromEntries(entries);

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

function formatDecimal(value, maxFractionDigits) {
  return value
    .toFixed(maxFractionDigits)
    .replace(/\.?0+$/, "")
    .replace(/^-0$/, "0");
}
