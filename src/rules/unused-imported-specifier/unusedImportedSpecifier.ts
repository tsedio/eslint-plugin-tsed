import {createRule} from "../../utils/createRule";
import {RuleRecommendation} from "@typescript-eslint/utils/ts-eslint";
import {getImportDeclarations} from "../../utils/getImportDeclarations";

type RULES = "unused-imported-specifier";

export const name = "unused-imported-specifier";

export const rule = createRule<[], RULES>({
  name,
  meta: {
    docs: {
      description:
        "Enforce all properties have an explicit defined status decorator",
      recommended: "error" as RuleRecommendation,
      requiresTypeChecking: true
    },
    messages: {
      "unused-imported-specifier": "The '{{token}}' is imported but never used."
    },
    type: "problem",
    fixable: "code",
    schema: []
  },
  defaultOptions: [],
  create(context) {
    return {
      "Program:exit"() {
        const program = context.sourceCode.ast;
        const imports = getImportDeclarations(program);

        const tokens = program.tokens.reduce((isUsed, token, currentIndex) => {
          if (token.type === "Identifier") {
            isUsed.set(token.value, (isUsed.get(token.value) || 0) + 1);
          }

          return isUsed;
        }, new Map());

        imports
          .filter((importDeclaration) => {
            return importDeclaration.source.value.startsWith("@tsed/");
          })
          .map((importDeclaration) => {
            importDeclaration.specifiers.forEach((specifier, index, specifiers) => {
              if (tokens.get(specifier.local.name) === 1) {
                context.report({
                  node: specifier,
                  messageId: "unused-imported-specifier",
                  data: {
                    token: specifier.local.name
                  },
                  fix(fixer) {
                    if (specifiers.length === 1) {
                      return fixer.remove(importDeclaration);
                    }

                    const end = specifiers[index + 1] ? specifiers[index + 1].range[0] : specifier.range[1];
                    const start = specifiers[index + 1] ? specifier.range[0] : specifiers[index - 1].range[1];

                    return fixer.removeRange([start, end]);
                  }
                });
              }
            });
          });
      }
    };
  }
});
