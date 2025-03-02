import fs from "fs"
import validateJsonParse from "./lib/rules/validate-json-parse.js"
import tseslint from "typescript-eslint"

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version
    },
    rules: {
        "validate-json-parse": validateJsonParse,
    },
}

const configs = {
    recommended: [{
        plugins: {safety: plugin},
        rules: {
            "safety/validate-json-parse": "error",
        }
    }],
    tseslint: tseslint.config({
        rules: {
            "@typescript-eslint/strict-boolean-expressions": "error"
        }
    })
}
configs.all = [...configs.recommended, ...configs.tseslint]
plugin.configs = configs

export {configs}
export default plugin
