import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { solid } from "../../src/index.js";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
const fixtureCode = `
  const cond = true;
  const A = () => <span />;
  const B = () => <span />;

  export const View = () => (
    <div>
      {cond && <A />}
      {cond ? <A /> : <B />}
      {(() => 1)()}
    </div>
  );
`;

test("solid preset wires platform JSX rules with expected severities", async () => {
  const tempDir = mkdtempSync(join(packageRoot, "tmp-jsx-runtime-"));
  const fixturePath = join(tempDir, "jsx-runtime.fixture.tsx");
  const originalCwd = process.cwd();

  writeFileSync(fixturePath, fixtureCode);

  try {
    // @typescript-eslint/parser resolves project-relative config from process.cwd().
    process.chdir(packageRoot);

    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: solid,
    });
    const config = await eslint.calculateConfigForFile(fixturePath);

    assert.deepEqual(config.rules["platform/no-jsx-short-circuit"], [2]);
    assert.deepEqual(config.rules["platform/no-jsx-ternary"], [2]);
    assert.deepEqual(config.rules["platform/no-iife-in-jsx"], [1]);

    const [result] = await eslint.lintFiles([fixturePath]);

    assert.equal(
      result.messages.some((message) => message.fatal),
      false,
    );

    const platformMessages = result.messages.filter(
      (message) =>
        message.ruleId === "platform/no-jsx-short-circuit" ||
        message.ruleId === "platform/no-jsx-ternary" ||
        message.ruleId === "platform/no-iife-in-jsx",
    );

    assert.equal(platformMessages.length, 3);
    assert.deepEqual(
      Object.fromEntries(
        platformMessages.map(({ ruleId, severity }) => [ruleId, severity]),
      ),
      {
        "platform/no-jsx-short-circuit": 2,
        "platform/no-jsx-ternary": 2,
        "platform/no-iife-in-jsx": 1,
      },
    );
  } finally {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  }
});
