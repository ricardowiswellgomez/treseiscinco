import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

test("platform dashboard labels PWA installation counts as client-reported", () => {
  assert.ok(app.includes('"PWA reportadas"'));
  assert.ok(app.includes('<span>Reporte de instalación</span>'));
  assert.ok(app.includes('x.is_installed?"Reportada":"Sin reporte"'));
  assert.ok(!app.includes('"PWA detectadas"'));
  assert.ok(!app.includes('x.is_installed?"Detectada":"No detectada"'));
});
