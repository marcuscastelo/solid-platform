import { RuleTester } from "eslint";
import { describe, it } from "node:test";
import plugin from "../src/index.js";
import { createRuleTesterConfig } from "./_shared.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester(createRuleTesterConfig(plugin));

ruleTester.run("platform/no-iife-in-jsx", plugin.rules["no-iife-in-jsx"], {
  valid: [
    {
      code: `
        const value = (() => 42)()
        const View = () => <div>{value}</div>
      `,
    },
    {
      code: `
        import { createMemo } from 'solid-js'

        const View = () => {
          const label = createMemo(() => 'ready')
          return <Show when={true}>{label()}</Show>
        }
      `,
    },
    {
      code: `
        const toLabel = (value) => \`item-\${value}\`
        const View = () => (
          <For each={[1, 2]}>
            {(value) => <span>{toLabel(value)}</span>}
          </For>
        )
      `,
    },
    {
      code: `
        const fallback = 'fallback'
        const View = () => (
          <Switch>
            {fallback}
          </Switch>
        )
      `,
    },
    {
      code: `
        const label = 'matched'
        const View = () => (
          <Match when={true}>
            {label}
          </Match>
        )
      `,
    },
    {
      code: `
        const toLabel = (value) => \`item-\${value}\`
        const View = () => (
          <Index each={[1, 2]}>
            {(item) => <span>{toLabel(item())}</span>}
          </Index>
        )
      `,
    },
  ],
  invalid: [
    {
      code: `
        const View = () => (
          <For each={[1, 2]}>
            {(item) => <span>{(() => item)()}</span>}
          </For>
        )
      `,
      errors: [{ messageId: "avoidIifeInJsx" }],
    },
    {
      code: `
        const View = () => (
          <Show when={true}>
            {(function () { return 'visible' })()}
          </Show>
        )
      `,
      errors: [{ messageId: "avoidIifeInJsx" }],
    },
    {
      code: `
        const View = () => (
          <Switch>
            {(() => 'fallback')()}
          </Switch>
        )
      `,
      errors: [{ messageId: "avoidIifeInJsx" }],
    },
    {
      code: `
        const View = () => (
          <Match when={true}>
            {(function () { return 'matched' })()}
          </Match>
        )
      `,
      errors: [{ messageId: "avoidIifeInJsx" }],
    },
    {
      code: `
        const View = () => (
          <Index each={[1, 2]}>
            {(item) => <span>{(() => item())()}</span>}
          </Index>
        )
      `,
      errors: [{ messageId: "avoidIifeInJsx" }],
    },
  ],
});
