import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/build.yml", import.meta.url), "utf8");

test("pull request builds never receive write permissions", () => {
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.doesNotMatch(workflow, /contents:\s*write/);
});

test("production deployment is isolated to main pushes and depends on a successful build", () => {
  const deploy = workflow.slice(workflow.indexOf("\n  deploy:"));
  assert.match(deploy, /if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/);
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /permissions:\n      contents: read/);
  assert.match(deploy, /CLOUDFLARE_API_TOKEN/);
  assert.match(deploy, /Ensure main has not advanced since this build/);
  assert.match(deploy, /npx wrangler deploy/);
});

test("the APK is shipped from the tested build artifact, not by writing back to main", () => {
  assert.match(workflow, /name: treseiscinco-dist/);
  assert.match(workflow, /name: Download tested static assets/);
  assert.doesNotMatch(workflow, /git push origin HEAD:main/);
});
