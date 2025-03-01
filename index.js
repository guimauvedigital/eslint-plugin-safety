const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version
    },
    rules: {
        "validate-json-parse": require("./lib/rules/validate-json-parse"),
    },
};

Object.assign(plugin.config, {
    recommended: {
        plugins: {safety: plugin},
        rules: {
            "@guimauvedigital/safety/validate-json-parse": "error"
        }
    }
})

module.exports = plugin;
