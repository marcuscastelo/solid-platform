import assert from "node:assert/strict";
import test from "node:test";
import defaultPlugin, {
  containerTrackerEslintPlugin,
  eslintPlugin,
  rules,
} from "../src/index.js";

test("plugin exports and metadata stay aligned", () => {
  assert.equal(defaultPlugin, eslintPlugin);
  assert.equal(defaultPlugin, containerTrackerEslintPlugin);
  assert.equal(defaultPlugin.rules, rules);
  assert.equal(defaultPlugin.meta.name, "@marcuscastelo/eslint-plugin");
});
