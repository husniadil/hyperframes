import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";

for (const [layout, skills] of [
  ["a release that nests skills/", "skills"],
  ["a bundle packaged from skills/", "."],
]) {
  test(`${layout} hands captions helpers the bundled launcher`, (t) => {
    const root = mkdtempSync(join(tmpdir(), "hf-cli-"));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const scripts = join(root, skills, "embedded-captions/scripts");
    mkdirSync(scripts, { recursive: true });
    mkdirSync(join(root, ".claude-plugin"));
    writeFileSync(
      join(root, ".claude-plugin/plugin.json"),
      JSON.stringify({ name: "hyperframes", version: "1.2.3" }),
    );
    copyFileSync(new URL("./hf-cli.cjs", import.meta.url), join(scripts, "hf-cli.cjs"));
    const found = execFileSync(process.execPath, [join(scripts, "hf-cli.cjs")], {
      encoding: "utf8",
      env: { ...process.env, HYPERFRAMES_ROOT: "" },
    });
    assert.equal(
      found.trim(),
      join(realpathSync(root), skills, "hyperframes/scripts/plugin-cli.mjs"),
    );
  });
}
