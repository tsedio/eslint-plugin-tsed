import {createRule} from "../../utils/createRule";
import {JSONSchema4TypeName} from "@typescript-eslint/utils/json-schema";
import {TSESTree} from "@typescript-eslint/utils";
import {findPropertyDecorator} from "../../utils/findDecorator";

export type NoDuplicateDecoratorsOptions = [
  {
    customList: string[];
  },
];

export const standardDecoratorsToValidate = ["Controller", "Injectable"];

export const name = "no-duplicate-decorators";
export const rule = createRule<NoDuplicateDecoratorsOptions, "no-duplicate-decorators">({
  name,
  meta: {
    docs: {
      description:
        "Some decorators should only be used once on a property or class. This rule enforces that.",
      requiresTypeChecking: false,
    },
    messages: {
      "no-duplicate-decorators":
        "You have listed the same decorator more than once. Was this intentional?",
    },
    schema: [
      {
        type: "object" as JSONSchema4TypeName,
        properties: {
          customList: {
            description:
              "A list of custom decorators that this rule will validate for duplicates",
            type: "array" as JSONSchema4TypeName,
            minItems: 0,
            items: {
              type: "string" as JSONSchema4TypeName,
              minLength: 1,
            },
          },
        },
      },
    ],
    fixable: "code",
    hasSuggestions: true,
    type: "suggestion",
  },
  defaultOptions: [
    {
      customList: new Array<string>(),
    },
  ],

  create(context) {
    const customListArrayItem = context.options?.[0];
    let decoratorsToValidate: string[] = customListArrayItem?.customList;
    if (
      !customListArrayItem?.customList ||
      customListArrayItem?.customList.length === 0
    ) {
      decoratorsToValidate = standardDecoratorsToValidate;
    }
    return {
      ["PropertyDefinition,ClassDeclaration"](node) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        const allDecorators = (
          node as TSESTree.PropertyDefinition | TSESTree.ClassDeclaration
        )?.decorators;
        if (allDecorators && allDecorators.length > 1) {
          const decoratorNames = allDecorators.map((decorator): string => {
            if (
              decorator.expression.type ===
              TSESTree.AST_NODE_TYPES.CallExpression &&
              decorator.expression.callee &&
              decorator.expression.callee.type ===
              TSESTree.AST_NODE_TYPES.Identifier
            ) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return decorator.expression.callee.name;
            }
            return "";
          });

          const duplicateDecorators = decoratorNames.filter(
            (decoratorName, index) => {
              return (
                decoratorName && decoratorNames.indexOf(decoratorName) !== index
              );
            },
          );

          if (
            duplicateDecorators.length > 0 &&
            decoratorsToValidate.some((decoratorToValidate) =>
              duplicateDecorators.includes(decoratorToValidate),
            )
          ) {
            context.report({
              node: node,
              messageId: "no-duplicate-decorators",
              suggest: [
                {
                  messageId: "no-duplicate-decorators",
                  * fix(fixer) {
                    for (const decoratorName of new Set(decoratorNames)) {
                      const decoratorToRemove = findPropertyDecorator(node, decoratorName);
                      if (decoratorToRemove) {
                        yield fixer.remove(decoratorToRemove);
                      }
                    }
                  },
                },
              ],
            });
          }
        }
      },
    };
  },
});

