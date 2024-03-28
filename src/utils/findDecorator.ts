import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";

export function findPropertyDecorator(node: TSESTree.PropertyDefinition, decoratorName: string) {
  const decorators = node.decorators ?? [];

  return decorators.find((decorator) => {
    return decorator.expression.type === AST_NODE_TYPES.CallExpression
      && decorator.expression.callee.type === AST_NODE_TYPES.Identifier
      && decorator.expression.callee.name === decoratorName;
  })
}
