import fs from "fs"
import validateJsonParse from "./lib/rules/validate-json-parse.js"
import preferNullable from "./lib/rules/prefer-nullable.js"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"))

const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version
    },
    rules: {
        "validate-json-parse": validateJsonParse,
        "prefer-nullable": preferNullable
    },
}

const configs = {
    owns: [{
        plugins: {safety: plugin},
        rules: {
            "safety/validate-json-parse": "error",
            "safety/prefer-nullable": "error"
        }
    }],
    tsExtras: tseslint.config({
        rules: {
            "@typescript-eslint/strict-boolean-expressions": "error"
        }
    }),
    core: [{
        rules: {
            "camelcase": "error"
        }
    }],
}
configs.all = [
    pluginJs.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...configs.owns,
    ...configs.tsExtras,
    ...configs.core,
]
plugin.configs = configs

export {configs}
export default plugin
