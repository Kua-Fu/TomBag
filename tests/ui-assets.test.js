import test from "node:test";
import assert from "node:assert/strict";
import { inflateSync } from "node:zlib";
import { readFileSync } from "node:fs";

test("logo asset is cropped RGBA with transparent corners", () => {
  const png = readPng("assets/logo.png");

  assert.equal(png.bitDepth, 8);
  assert.equal(png.colorType, 6);
  assert.ok(png.width <= 180);
  assert.ok(png.height <= 280);
  assert.equal(png.alphaAt(0, 0), 0);
  assert.equal(png.alphaAt(png.width - 1, 0), 0);
  assert.equal(png.alphaAt(0, png.height - 1), 0);
  assert.equal(png.alphaAt(png.width - 1, png.height - 1), 0);
});

test("tool pages use the same shell sizing class", () => {
  for (const file of ["index.html", "timestamp.html", "unit-converter.html"]) {
    const html = readFileSync(file, "utf8");
    assert.match(html, /<main class="app-shell">/);
  }

  const css = readFileSync("src/styles.css", "utf8");
  assert.doesNotMatch(css, /app-shell\.json-layout/);
  assert.doesNotMatch(css, /linear-gradient\(45deg, #f1f5f9/);
  assert.match(css, /html,\s*body\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.app-shell\s*\{[^}]*height:\s*calc\(100vh - 24px\)/s);
  assert.match(css, /\.json-workbench\s*\{[^}]*flex:\s*1 1 auto/s);
  assert.doesNotMatch(css, /#162219|#101827|#0f172a|#314132/i);
});

test("unit converter exposes presets and renders an initial result", () => {
  const html = readFileSync("unit-converter.html", "utf8");
  const js = readFileSync("src/unit-converter.js", "utf8");

  assert.match(html, /id="presetList"/);
  assert.match(js, /const PRESETS = \[/);
  assert.match(js, /setSample\(\);\s*convert\(\);/);
});

test("background controls and extension build are present", () => {
  const indexHtml = readFileSync("index.html", "utf8");
  const css = readFileSync("src/styles.css", "utf8");
  const appShell = readFileSync("src/app-shell.js", "utf8");
  const manifest = JSON.parse(readFileSync("chrome-extension/manifest.json", "utf8"));
  const background = readFileSync("chrome-extension/background.js", "utf8");

  assert.match(indexHtml, /data-setting="background"/);
  assert.match(indexHtml, /data-setting="backgroundFile"/);
  assert.match(css, /--app-background-image/);
  assert.match(appShell, /assets\/background\.png/);
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.name, "TomBag");
  assert.match(background, /chrome\.tabs\.create/);
});

function readPng(file) {
  const buffer = readFileSync(file);
  assert.deepEqual(buffer.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset += length + 12;
  }

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const rows = [];
  let sourceOffset = 0;
  let previous = Buffer.alloc(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const source = inflated.subarray(sourceOffset, sourceOffset + stride);
    const row = Buffer.alloc(stride);

    for (let index = 0; index < stride; index += 1) {
      const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
      const up = previous[index];
      const upLeft = index >= bytesPerPixel ? previous[index - bytesPerPixel] : 0;
      row[index] = (source[index] + predict(filter, left, up, upLeft)) & 0xff;
    }

    rows.push(row);
    previous = row;
    sourceOffset += stride;
  }

  return {
    width,
    height,
    bitDepth,
    colorType,
    alphaAt: (x, y) => rows[y][x * bytesPerPixel + 3],
  };
}

function predict(filter, left, up, upLeft) {
  if (filter === 0) {
    return 0;
  }
  if (filter === 1) {
    return left;
  }
  if (filter === 2) {
    return up;
  }
  if (filter === 3) {
    return Math.floor((left + up) / 2);
  }
  if (filter === 4) {
    return paeth(left, up, upLeft);
  }
  throw new Error(`Unsupported PNG filter: ${filter}`);
}

function paeth(left, up, upLeft) {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) {
    return left;
  }
  return pb <= pc ? up : upLeft;
}
