import test from "node:test";
import assert from "node:assert/strict";

import { filterJsonListItems, findJsonListItem, parseJsonInput, summarizeJson } from "../src/json-utils.js";
import { convertDateToTimestamp, convertTimestampToDate } from "../src/time-utils.js";
import { categoryLabel, convertUnit, getCategoryById, parseMeasurement, unitLabel, unitSymbol } from "../src/units.js";

test("JSON parser unwraps stringified JSON dumps", () => {
  const parsed = parseJsonInput('"{\\"product\\":\\"TomBag\\",\\"enabled\\":true}"');

  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.value, { product: "TomBag", enabled: true });
  assert.equal(summarizeJson(parsed.value), "对象，2 个字段");
});

test("JSON list finder returns matching object and source path", () => {
  const value = {
    data: {
      list: [
        { id: "alpha", count: 1 },
        { id: "beta", count: 2 },
      ],
    },
  };

  const result = findJsonListItem(value, "id", "beta");
  assert.equal(result.path, "$.data.list");
  assert.equal(result.index, 1);
  assert.deepEqual(result.item, { id: "beta", count: 2 });
});

test("JSON list filter supports dot paths and contains mode", () => {
  const value = {
    payload: [
      { id: "alpha", owner: { team: "garden" }, label: "first bed" },
      { id: "beta", owner: { team: "kitchen" }, label: "second pantry" },
      { id: "gamma", owner: { team: "garden" }, label: "third bed" },
    ],
  };

  const byPath = filterJsonListItems(value, "owner.team", "garden", { mode: "exact" });
  assert.deepEqual(
    byPath.items.map((item) => item.id),
    ["alpha", "gamma"]
  );

  const byAnyValue = filterJsonListItems(value, "", "pan", { mode: "contains" });
  assert.deepEqual(
    byAnyValue.items.map((item) => item.id),
    ["beta"]
  );
});

test("timestamp conversion handles Shanghai and UTC", () => {
  const shanghai = convertDateToTimestamp("1970-01-01 08:00:00", "Asia/Shanghai", "s");
  assert.deepEqual(shanghai, { ok: true, value: "0", ms: 0 });

  const utc = convertTimestampToDate("0", "s", "UTC");
  assert.deepEqual(utc, { ok: true, value: "1970-01-01 00:00:00", ms: 0 });
});

test("unit converter parses inline unit tokens", () => {
  const category = getCategoryById("data-size");
  const parsed = parseMeasurement("1024 KiB", category);

  assert.equal(parsed.value, 1024);
  assert.equal(parsed.matchedUnitId, "KiB");
});

test("unit converter supports data size and percent conversions", () => {
  const data = convertUnit({
    categoryId: "data-size",
    value: 8,
    fromUnitId: "b",
    toUnitId: "B",
  });
  assert.equal(data.ok, true);
  assert.equal(data.convertedValue, 1);

  const percent = convertUnit({
    categoryId: "percent",
    value: 12.5,
    fromUnitId: "%",
    toUnitId: "ratio",
  });
  assert.equal(percent.ok, true);
  assert.equal(percent.convertedValue, 0.125);
});

test("English unit labels use international symbols and binary prefixes", () => {
  const dataSize = getCategoryById("data-size");
  assert.equal(categoryLabel(dataSize, "en"), "Data Size");
  assert.equal(unitLabel(dataSize.units.find((unit) => unit.id === "KB"), "en"), "kB (kilobyte, 10^3 bytes)");
  assert.equal(unitLabel(dataSize.units.find((unit) => unit.id === "KiB"), "en"), "KiB (kibibyte, 2^10 bytes)");

  const bandwidth = getCategoryById("bandwidth");
  assert.equal(unitSymbol(bandwidth.units.find((unit) => unit.id === "Kbps"), "en"), "kbit/s");
});
