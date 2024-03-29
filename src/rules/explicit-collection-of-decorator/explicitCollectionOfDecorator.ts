import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";
import {createMessages, createRule, RuleOptions} from "../../utils/createRule";
import {DecoratorsStatus, getDecoratorsStatus} from "../../utils/getDecoratorsStatus";
import {RuleContext} from "@typescript-eslint/utils/ts-eslint";
import {findPropertyDecorator} from "../../utils/findDecorator";
import {getTypes} from "../../utils/getTypes";
import {getWhiteSpaces} from "../../utils/getWhiteSpaces";

type RULES =
  | "missing-collection-of-decorator"
  | "unnecessary-property-of-decorator"
  | "unnecessary-collection-of-decorator";

type DECORATORS_TYPES = "Property" | "CollectionOf" | "MapOf" | "ArrayOf";
const DECORATORS: DECORATORS_TYPES[] = ["Property", "CollectionOf", "MapOf", "ArrayOf"];

const TYPES_TO_DECORATORS: Record<string, DECORATORS_TYPES> = {
  Array: "ArrayOf",
  Set: "CollectionOf",
  Map: "MapOf",
}

interface CollectionOfDecoratorsStatus extends DecoratorsStatus<DECORATORS_TYPES> {
  isCollection: boolean;
}

const RULES_CHECK: RuleOptions<RULES, CollectionOfDecoratorsStatus>[] = [
  {
    messageId: "unnecessary-property-of-decorator",
    message: "Unnecessary Property decorator over a Property returning Array, Set or Map",
    test: ({decorators, isCollection}) =>
      isCollection
      && decorators.has("Property")
      && (decorators.has("CollectionOf") || decorators.has("MapOf") || decorators.has("ArrayOf")),
    fix(fixer, node) {
      const propertyDecorator = findPropertyDecorator(node, "Property");

      return propertyDecorator ? fixer.remove(propertyDecorator) : null;
    },
  },
  {
    messageId: "unnecessary-collection-of-decorator",
    message: "Unexpected CollectionOf decorator over a Property not returning Array, Set or Map",
    test: ({decorators, isCollection}) =>
      !isCollection
      && decorators.has("CollectionOf"),
    fix(fixer, node) {
      const collectionOfDecorator = findPropertyDecorator(node, "CollectionOf");

      return collectionOfDecorator ? fixer.remove(collectionOfDecorator) : null;
    },
  },
  {
    messageId: "missing-collection-of-decorator",
    message: "Property returning Array, Set or Map must set CollectionOf decorator",
    test: ({decorators, isCollection}) =>
      isCollection && !decorators.has("CollectionOf"),
    fix(fixer, node) {
      const {itemType, collectionType} = getTypes(node);

      const propertyDecorator = findPropertyDecorator(node, "Property");
      const decoratorName = TYPES_TO_DECORATORS[collectionType as string];

      if (propertyDecorator) {
        return fixer.replaceText(propertyDecorator, `@${decoratorName}(${itemType})`);
      }

      return fixer.insertTextBefore(node, `@${decoratorName}(${itemType})\n${getWhiteSpaces(node)}`);
    },
  },
];

function create(context: Readonly<RuleContext<RULES, []>>) {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PropertyDefinition: (node: TSESTree.PropertyDefinition) => {
      // for each property in the class
      const decoratorsStatus = getDecoratorsStatus<
        DECORATORS_TYPES
      >(node, DECORATORS) as CollectionOfDecoratorsStatus;

      // if there is no Ts.ED decorator we don't care about this property
      if (!decoratorsStatus.hasSchemaDecorator) {
        return;
      }

      decoratorsStatus.isCollection = AST_NODE_TYPES.TSArrayType === node.typeAnnotation?.typeAnnotation?.type as AST_NODE_TYPES.TSArrayType
        || ["Array", "Map", "Set"].includes(
          (node.typeAnnotation?.typeAnnotation as any | undefined)?.typeName?.name,
        );

      RULES_CHECK
        .some(({messageId, test, fix}) => {
          if (test(decoratorsStatus)) {
            context.report({
              node,
              messageId,
              fix: fix && ((fixer) => fix(fixer, node, decoratorsStatus)),
            });

            return true;
          }

          return false;
        });
    },
  };
}

export const name = "explicit-collection-of-decorator";
export const rule = createRule<[], RULES>({
  name,
  meta: {
    docs: {
      description: "Property returning array must set CollectionOf decorator",

      requiresTypeChecking: false,
    },
    messages: createMessages<RULES>(RULES_CHECK),
    schema: [],
    hasSuggestions: false,
    type: "problem",
    fixable: "code",
  },
  defaultOptions: [],
  create,
});

