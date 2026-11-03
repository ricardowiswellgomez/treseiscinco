import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const worker = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");

test("signup sends the server-verified Turnstile token to Supabase Auth native CAPTCHA", () => {
  assert.ok(worker.includes("const captchaToken=String(req.headers.get(\"x-turnstile-token\")||\"\")"));
  assert.ok(worker.includes("verification?.action!==\"signup\""));
  assert.ok(worker.includes("const signupBody=JSON.stringify({...data,gotrue_meta_security:{captcha_token:captchaToken}})"));
  assert.ok(worker.includes('body:signupBody'));
  assert.ok(!worker.includes('body:raw,redirect:"manual"'));
});
