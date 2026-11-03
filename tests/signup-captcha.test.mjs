import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const worker = await readFile(new URL("../src/worker.js", import.meta.url), "utf8");

test("signup forwards Turnstile token for Supabase Auth native CAPTCHA verification", () => {
  const start = worker.indexOf("async function protectedSignup");
  const end = worker.indexOf("export default", start);
  assert.ok(start >= 0 && end > start);
  const signup = worker.slice(start, end);
  assert.ok(signup.includes('const captchaToken=String(req.headers.get("x-turnstile-token")||"")'));
  assert.ok(signup.includes("const signupBody=JSON.stringify({...data,gotrue_meta_security:{captcha_token:captchaToken}})"));
  assert.ok(signup.includes("body:signupBody"));
  assert.ok(!signup.includes("/siteverify"), "single-use token must be verified only once by Supabase Auth");
  assert.ok(signup.includes("env.SIGNUP_LIMITER"), "the Worker must continue rate limiting by IP");
});
