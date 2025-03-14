const {AST_NODE_TYPES} = require("@typescript-eslint/utils")

module.exports = {
    meta: {
        type: "suggestion",
        fixable: "code",
        docs: {
            description: "Enforce using Nullable<T> instead of explicit nullable types.",
            recommended: true,
        },
        schema: [],
        messages: {
            replaceWithNullable: "Use Nullable<T> instead of explicit nullable types.",
        },
    },
    create(context) {
        let hasImportedNullable = false

        return {
            Program(node) {
                hasImportedNullable = node.body.some(
                    (statement) =>
                        statement.type === AST_NODE_TYPES.ImportDeclaration &&
                        statement.source.value === "better-nullable" &&
                        statement.specifiers.some(
                            (specifier) =>
                                specifier.type === AST_NODE_TYPES.ImportSpecifier &&
                                specifier.imported.name === "Nullable"
                        )
                )
            },
            TSTypeAnnotation(node) {
                if (!node.typeAnnotation) return

                const sourceCode = context.getSourceCode()
                const originalTypeText = sourceCode.getText(node.typeAnnotation)
                let fixNeeded = false
                let shouldRemoveOptional = false
                let typeText = originalTypeText

                const processUnionType = (unionNode) => {
                    if (!unionNode.types) return null
                    const types = unionNode.types.map((t) => sourceCode.getText(t))
                    const nonNullableTypes = types.filter(
                        (t) => t !== "null" && t !== "undefined"
                    )
                    return types.length !== nonNullableTypes.length ? nonNullableTypes.join(" | ") : null
                }

                // Check if it's an optional property
                if (
                    node.parent.type === AST_NODE_TYPES.TSPropertySignature &&
                    node.parent.optional
                ) {
                    typeText = `Nullable<${typeText}>`
                    fixNeeded = true
                    shouldRemoveOptional = true
                }

                // Check function parameters and return types
                if (
                    node.parent.type === AST_NODE_TYPES.TSParameterProperty ||
                    node.parent.type === AST_NODE_TYPES.Identifier ||
                    node.parent.type === AST_NODE_TYPES.TSFunctionType
                ) {
                    const parent = node.parent
                    if (
                        parent.optional ||
                        (node.typeAnnotation.type === AST_NODE_TYPES.TSUnionType && processUnionType(node.typeAnnotation))
                    ) {
                        typeText = processUnionType(node.typeAnnotation) ?? typeText
                        fixNeeded = typeText !== originalTypeText
                    }
                }

                // Check union types
                if (node.typeAnnotation.type === AST_NODE_TYPES.TSUnionType) {
                    const newTypeText = processUnionType(node.typeAnnotation)
                    if (newTypeText) {
                        typeText = `Nullable<${newTypeText}>`
                        fixNeeded = typeText !== originalTypeText
                    }
                }

                // Handle generic types like Promise<T>
                if (node.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
                    const typeName = sourceCode.getText(node.typeAnnotation.typeName)
                    if (node.typeAnnotation.typeArguments) {
                        const newParams = node.typeAnnotation.typeArguments.params.map((param) => {
                            if (param.type === AST_NODE_TYPES.TSUnionType) {
                                const newParamText = processUnionType(param)
                                return newParamText ? `Nullable<${newParamText}>` : sourceCode.getText(param)
                            }
                            return sourceCode.getText(param)
                        })
                        typeText = `${typeName}<${newParams.join(", ")}>`
                        fixNeeded = typeText !== originalTypeText
                    }
                }

                if (fixNeeded) context.report({
                    node,
                    messageId: "replaceWithNullable",
                    fix(fixer) {
                        const fixes = shouldRemoveOptional ? [
                            fixer.replaceText(node.parent, `${node.parent.key.name}: ${typeText}`)
                        ] : [
                            fixer.replaceText(node, `: ${typeText}`)
                        ]
                        if (!hasImportedNullable) fixes.push(
                            fixer.insertTextBefore(
                                context.getSourceCode().ast.body[0],
                                `import { Nullable } from "better-nullable"\n`
                            )
                        )
                        hasImportedNullable = true
                        return fixes
                    },
                })
            },
        }
    },
}
