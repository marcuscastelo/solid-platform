import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import plugin from "../src/index.js";
import { createRuleTesterConfig } from "./_shared.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester(createRuleTesterConfig(plugin));

ruleTester.run("platform/no-jsx-ternary", plugin.rules["no-jsx-ternary"], {
  valid: [
    {
      code: `
        const View = () => <div>{cond ? 'A' : 'B'}</div>
      `,
    },
    {
      code: `
        const View = () => <div>{cond ? valueA : valueB}</div>
      `,
    },
    {
      code: `
        const View = () => <div>{cond ? 1 : 2}</div>
      `,
    },
    {
      code: `
        const View = () => (
          <Show when={cond}>
            <A />
          </Show>
        )
      `,
    },
    {
      code: `
        const View = () => (
          <Show when={cond} fallback={<B />}>
            <A />
          </Show>
        )
      `,
    },
  ],
  invalid: [
    {
      code: `
        const View = () => <div>{cond ? <A /> : <B />}</div>
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
    {
      code: `
        const View = () => <div>{cond ? <A /> : null}</div>
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
    {
      code: `
        const View = () => <div>{cond ? <><A /></> : <B />}</div>
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
    {
      code: `
        const View = () => <div>{cond ? <A /> : <></>}</div>
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
    {
      code: `
        const View = () => (
          <div>
            {cond
              ? <ComponentA />
              : <ComponentB />
            }
          </div>
        )
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
    {
      code: `
        const View = () => (
          <div>{cond ? ((<A /> satisfies JSX.Element) as JSX.Element)! : value}</div>
        )
      `,
      errors: [{ messageId: "avoidJsxTernary" }],
    },
  ],
});
