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
  assert.ok(worker.includes("const applySecurityHeaders=headers=>"));
  assert.ok(worker.includes("const secureResponse=response=>"));
  assert.ok(worker.includes('return secureResponse(new Response(null,{status:302'));
  assert.ok(worker.includes('return secureResponse(new Response(apk.body'));
  assert.ok(worker.includes('return secureResponse(new Response(mp3'));
  assert.ok(worker.includes('return secureResponse(new Response("<!doctype html'));
  const signupStart = worker.indexOf("async function protectedSignup");
  const signupEnd = worker.indexOf("export default", signupStart);
  assert.ok(signupStart >= 0 && signupEnd > signupStart);
  assert.ok(worker.slice(signupStart, signupEnd).includes("headers:applySecurityHeaders(responseHeaders)"), "successful signup proxy response must also carry security headers");
});
