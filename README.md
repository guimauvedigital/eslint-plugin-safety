# ESLint rules we use at Guimauve Digital

A monster against bad code

## Install ESLint first

```bash
npm init @eslint/config@latest
```

Follow the base instructions and choose the options you want.

## Install the plugin

```bash
npm install @guimauvedigital/eslint-plugin-safety --save-dev
```

## Add the plugin

Update your `eslint.config.mjs` file to add the plugin:

```js
import safety from "@guimauvedigital/eslint-plugin-safety"

export default [
    // Keep existing rules, only add the plugin
    safety,
];
```

## Bonuses

There are good ideas taken from [The long-tail of type safety | App.js Conf 2023](https://youtu.be/3yKv_ReBCpo).

### TypeScript config

Update `tsconfig.json` and add the following settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### TypeScript ESLint plugin

Checkout [typescript-eslint](https://typescript-eslint.io) plugin for more TypeScript specific rules.

This is often already installed when you create a new project with `npm init @eslint/config@latest` if TypeScript is
selected.

### TypeScript Reset

[ts-reset](https://www.totaltypescript.com/ts-reset) is a package that adds extra TypeScript checks about typings.

Install it with `npm i -D @total-typescript/ts-reset` and create a
`reset.d.ts` file:

```ts
// Do not add any other lines of code to this file!
import "@total-typescript/ts-reset";
```
