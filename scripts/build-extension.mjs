import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "chrome-extension");

await rm(outDir, { force: true, recursive: true });
await mkdir(join(outDir, "assets"), { recursive: true });
await mkdir(join(outDir, "src"), { recursive: true });

for (const file of ["index.html", "timestamp.html", "unit-converter.html"]) {
  await copyFile(join(root, file), join(outDir, file));
}

for (const file of ["logo.png", "background.png"]) {
  await copyFile(join(root, "assets", file), join(outDir, "assets", file));
}

for (const file of [
  "app-shell.js",
  "json-tool.js",
  "json-utils.js",
  "styles.css",
  "time-utils.js",
  "timestamp.js",
  "unit-converter.js",
  "units.js",
]) {
  await copyFile(join(root, "src", file), join(outDir, "src", file));
}

await writeFile(
  join(outDir, "manifest.json"),
  `${JSON.stringify(
    {
      manifest_version: 3,
      name: "TomBag",
      description: "JSON viewer, timestamp converter, and standards-aware unit converter.",
      version: "0.1.0",
      action: {
        default_title: "TomBag",
        default_icon: {
          16: "assets/logo.png",
          32: "assets/logo.png",
          48: "assets/logo.png",
          128: "assets/logo.png",
        },
      },
      icons: {
        16: "assets/logo.png",
        32: "assets/logo.png",
        48: "assets/logo.png",
        128: "assets/logo.png",
      },
      permissions: ["storage"],
      background: {
        service_worker: "background.js",
      },
      web_accessible_resources: [
        {
          resources: ["assets/*"],
          matches: ["<all_urls>"],
        },
      ],
    },
    null,
    2
  )}\n`
);

await writeFile(
  join(outDir, "background.js"),
  `chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
`
);

console.log(`Built Chrome extension at ${outDir}`);
