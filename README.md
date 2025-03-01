# ESLint rules we use at Guimauve Digital

A monster against bad code

## Install the plugin

```bash
npm install @guimauvedigital/eslint-plugin-safety --save-dev
```

## Add the plugin to your `.eslintrc.js` file

```js
module.exports = {
    plugins: ["@guimauvedigital/safety"],
    rules: {
        // You can enable the rules you want here
        // See /lib/rules for the list of available rules
        "@guimauvedigital/safety/validate-json-parse": "error"
    }
};
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

### TypeScript Reset

[ts-reset](https://www.totaltypescript.com/ts-reset) is a package that adds extra TypeScript checks about typings.

Install it with `npm i -D @total-typescript/ts-reset` and create a
`reset.d.ts` file:

```ts
// Do not add any other lines of code to this file!
import "@total-typescript/ts-reset";
```
