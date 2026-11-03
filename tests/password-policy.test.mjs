import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const worker = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");

test("signup and password recovery share a 12-to-128 character policy", () => {
  assert.match(app, /mode === "signup" \|\| mode === "update-password"/);
  assert.match(app, /password\.length < 12 \|\| password\.length > 128/);
  assert.match(worker, /password\.length<12\|\|password\.length>128/);
});

test("the recovery overlay validates the new password and its confirmation", () => {
  assert.match(worker, /pass\.minLength=12;pass\.maxLength=128/);
  assert.match(worker, /confirm\.minLength=12;confirm\.maxLength=128/);
  assert.match(worker, /pass\.value\.length<12\|\|pass\.value\.length>128/);
});
