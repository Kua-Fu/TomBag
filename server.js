import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const rootDir = dirname(fileURLToPath(import.meta.url));

app.use(
  express.static(rootDir, {
    extensions: ["html"],
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, product: "TomBag" });
});

app.use((_req, res) => {
  res.status(404).sendFile(join(rootDir, "index.html"));
});

app.listen(port, () => {
  console.log(`TomBag is running at http://localhost:${port}`);
});
