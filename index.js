import fs from "fs";
import validateJsonParse from "./lib/rules/validate-json-parse.js";

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
    recommended: {
        plugins: {safety: plugin},
        rules: {
            "@guimauvedigital/safety/validate-json-parse": "error"
        }
    }
}
plugin.configs = configs

export {configs}
export default plugin
