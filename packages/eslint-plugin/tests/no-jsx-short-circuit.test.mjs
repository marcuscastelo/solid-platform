import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import plugin from "../src/index.js";
import { createRuleTesterConfig } from "./_shared.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester(createRuleTesterConfig(plugin));

ruleTester.run(
  "platform/no-jsx-short-circuit",
  plugin.rules["no-jsx-short-circuit"],
  {
    valid: [
      {
        code: `
          const View = () => <div>{cond && 'x'}</div>
        `,
      },
      {
        code: `
          const someValue = 'ready'
          const View = () => <div>{cond && someValue}</div>
        `,
      },
      {
        code: `
          const foo = { bar: () => 'ok' }
          const View = () => <div>{cond && foo?.bar()}</div>
        `,
      },
      {
        code: `
          const View = () => <div>{cond && (() => <A />)}</div>
        `,
      },
      {
        code: `
          const someValue = 1
          const maybe = cond && someValue
          const View = () => <div>{maybe}</div>
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
    ],
    invalid: [
      {
        code: `
          const View = () => <div>{cond && <A />}</div>
        `,
        errors: [{ messageId: "avoidJsxShortCircuit" }],
      },
      {
        code: `
          const View = () => <div>{cond && <><A /></>}</div>
        `,
        errors: [{ messageId: "avoidJsxShortCircuit" }],
      },
      {
        code: `
          const View = () => <div>{cond && (foo ? <A /> : <B />)}</div>
        `,
        errors: [{ messageId: "avoidJsxShortCircuit" }],
      },
      {
        code: `
          const View = () => <div>{a && (b && <A />)}</div>
        `,
        errors: [{ messageId: "avoidJsxShortCircuit" }],
      },
      {
        code: `
          const View = () => <div>{cond && ((<A /> satisfies JSX.Element) as JSX.Element)!}</div>
        `,
        errors: [{ messageId: "avoidJsxShortCircuit" }],
      },
    ],
  },
);
