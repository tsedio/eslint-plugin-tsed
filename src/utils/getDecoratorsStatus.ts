import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";
import {typedTokenHelpers} from "./typedTokenHelpers";

export interface DecoratorsStatus<Decorators> {
  hasSchemaDecorator: boolean;
  decorators: Map<Decorators, TSESTree.Decorator[]>;
}

export function getDecoratorsStatus<Decorators extends string = string>(
  propertyDefinition: TSESTree.PropertyDefinition,
  decorators: Decorators[]
): DecoratorsStatus<Decorators> {
  const options = {
    hasSchemaDecorator: false,
    decorators: new Map<Decorators, TSESTree.Decorator[]>()
  };

  if (!propertyDefinition.decorators) {
    return options;
  }

  const program = typedTokenHelpers.getRootProgram(propertyDefinition);


  return propertyDefinition.decorators
    .reduce((options, decorator) => {
      if (!(
        decorator.expression.type === AST_NODE_TYPES.CallExpression
        && decorator.expression.callee.type === AST_NODE_TYPES.Identifier
        && typedTokenHelpers.decoratorIsTsEDSchemaDecorator(
          program,
          decorator
        ))) {

        return options;
      }

      const {name: decoratorName} = decorator.expression.callee;
      options.hasSchemaDecorator = true;

      decorators.forEach((name) => {
        if (name === decoratorName) {
          options.decorators.set(name, (options.decorators.get(name) || []).concat(decorator));
        }
      });

      return options;
    }, options);
}
