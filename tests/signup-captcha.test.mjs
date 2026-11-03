import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerSource = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");
const start = workerSource.indexOf('const signupSecurityScript="');
const end = workerSource.indexOf('";const patched=', start);
assert.ok(start >= 0 && end > start, "the injected auth CAPTCHA script must exist");
const scriptLiteral = workerSource.slice(start + 'const signupSecurityScript='.length, end + 1);
const authScript = JSON.parse(scriptLiteral);

test("the same CAPTCHA widget protects sign-up, password login and recovery", () => {
  assert.ok(authScript.includes('function currentAuthForm()'));
  for (const label of ['"Crea tu cuenta"','"Recupera tu acceso"','"Inicia sesión"']) {
    assert.ok(authScript.includes(label), "missing auth mode " + label);
  }
  assert.ok(authScript.includes('url.pathname === "/auth/v1/signup"'));
  assert.ok(authScript.includes('url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "password"'));
  assert.ok(authScript.includes('url.pathname === "/auth/v1/recover"'));
});

test("every protected auth request gets the native Supabase CAPTCHA field", () => {
  assert.ok(authScript.includes("payload.gotrue_meta_security = {...(payload.gotrue_meta_security || {}),captcha_token:token}"));
  assert.ok(authScript.includes("window.__t365AuthCaptchaToken"));
  assert.ok(authScript.includes("window.__t365ResetAuthCaptcha"));
  assert.ok(authScript.includes("turnstile.reset(widgetId)"));
  assert.ok(authScript.includes('action:"auth"'));
  assert.ok(!authScript.includes("/siteverify"), "Supabase Auth must verify each single-use token only once");
});

test("all authentication forms block submission without a challenge", () => {
  assert.ok(authScript.includes('["Crea tu cuenta","Recupera tu acceso","Inicia sesión"].includes(mode)'));
  assert.ok(authScript.includes('if (!currentAuthForm() || window.__t365AuthCaptchaToken) return;'));
  assert.ok(authScript.includes('event.stopImmediatePropagation()'));
});

test("signup keeps its Worker rate limit and forwards the token to Supabase native CAPTCHA", () => {
  const signupStart = workerSource.indexOf("async function protectedSignup");
  const signupEnd = workerSource.indexOf("export default", signupStart);
  const signup = workerSource.slice(signupStart, signupEnd);
  assert.ok(signup.includes("env.SIGNUP_LIMITER"));
  assert.ok(signup.includes('gotrue_meta_security:{captcha_token:captchaToken}'));
  assert.ok(signup.includes("body:signupBody"));
  assert.ok(!signup.includes("/siteverify"));
});
