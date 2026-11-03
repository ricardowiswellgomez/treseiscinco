import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const migration = readFileSync(new URL("../supabase/migrations/20261029040000_reject_disposable_signup_domains.sql", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

test("signup proxy forwards Turnstile to native Supabase CAPTCHA and rate limits by IP", () => {
  assert.match(worker, /async function protectedSignup\(/);
  assert.match(worker, /env\.SIGNUP_LIMITER/);
  assert.match(worker, /gotrue_meta_security:\{captcha_token:captchaToken\}/);
  assert.doesNotMatch(worker, /env\.TURNSTILE_SECRET/);
  assert.doesNotMatch(worker, /challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
  assert.match(worker, /password\.length<12\|\|password\.length>128/);
  assert.match(config.ratelimits.find((item) => item.name === "SIGNUP_LIMITER")?.simple?.limit?.toString() || "", /5/);
});

test("temporary email providers are rejected at the server boundary", () => {
  assert.match(worker, /37xiao\.com/);
  assert.match(worker, /Ese dominio de correo es temporal/);
  assert.match(migration, /CREATE TRIGGER reject_disposable_signup_email/);
  assert.match(migration, /37xiao\.com/);
  assert.match(migration, /BEFORE INSERT OR UPDATE OF email ON auth\.users/);
});

test("the frontend intercepts the Auth signup request and requires a token", () => {
  assert.match(worker, /treseiscinco-signup-security/);
  assert.match(worker, /x-turnstile-token/);
  assert.ok(worker.includes("gotrue_meta_security:{captcha_token:captchaToken}"));
  assert.match(worker, /window\\.__t365AuthCaptchaToken/);
  assert.match(worker, /window\.__t365AuthCaptchaToken/);
  assert.match(app, /minLength=\{mode === "signup" \? 12 : 6\}/);
});
