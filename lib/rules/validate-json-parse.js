module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure JSON.parse() is validated with Zod",
            category: "Best Practices",
        },
        fixable: null,
        schema: [], // No options for now
    },
    create(context) {
        return {
            CallExpression(node) {
                // Detect `JSON.parse()`
                if (
                    node.callee &&
                    node.callee.type === "MemberExpression" &&
                    node.callee.object.name === "JSON" &&
                    node.callee.property.name === "parse"
                ) {
                    const parent = node.parent;

                    // Check if it's used inside a Zod validation
                    if (
                        parent &&
                        parent.type === "CallExpression" &&
                        parent.callee &&
                        parent.callee.property &&
                        (parent.callee.property.name === "parse" ||
                            parent.callee.property.name === "safeParse")
                    ) {
                        return;
                    }

                    // Report an error if JSON.parse() is used without validation
                    context.report({
                        node,
                        message:
                            "JSON.parse() must be validated with Zod (e.g., Schema.parse or safeParse).",
                    });
                }
            },
        };
    },
};
  