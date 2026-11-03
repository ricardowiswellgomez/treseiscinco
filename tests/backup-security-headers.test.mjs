import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const worker = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");

test("business backup includes cash register sessions", () => {
  const start = app.indexOf("async function downloadBusinessBackup()");
  const end = app.indexOf("\n\n  useEffect(", start);
  assert.ok(start >= 0 && end > start);
  assert.match(app.slice(start, end), /"cash_register_sessions"/);
});

test("statistics label period net cash flow instead of bank balance", () => {
  assert.match(app, /\["Flujo neto del periodo", statsCashBalance \/ unit\]/);
  assert.match(app, /<span>Flujo neto del periodo<\/span>/);
  assert.match(app, /No representa el saldo bancario actual/);
});

test("Worker sets baseline browser security response headers", () => {
  for (const header of [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security"
  ]) assert.ok(worker.includes(header), "missing " + header);
  assert.match(worker, /function applySecurityHeaders/);
  assert.match(worker, /function secureResponse/);
});
