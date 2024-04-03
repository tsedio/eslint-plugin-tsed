import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";
import {createMessages, createRule, RuleOptions} from "../../utils/createRule";
import {DecoratorsStatus, getDecoratorsStatus} from "../../utils/getDecoratorsStatus";
import {RuleContext} from "@typescript-eslint/utils/ts-eslint";
import {findPropertyDecorator} from "../../utils/findDecorator";
import {getTypes} from "../../utils/getTypes";
import {getWhiteSpaces} from "../../utils/getWhiteSpaces";
import {addImportSpecifier} from "../../utils/addImportSpecifier";

type RULES =
  | "missing-collection-of-decorator"
  | "unnecessary-array-of-decorator"
  | "unnecessary-map-of-decorator"
  | "unnecessary-property-of-decorator"
  | "unnecessary-collection-of-decorator"
  | "unexpected-map-of-decorator";

type DECORATORS_TYPES = "Property" | "CollectionOf" | "MapOf" | "ArrayOf" | "Enum";
const DECORATORS: DECORATORS_TYPES[] = ["Property", "CollectionOf", "MapOf", "ArrayOf", "Enum"];

const TYPES_TO_DECORATORS: Record<string, DECORATORS_TYPES> = {
  Array: "ArrayOf",
  Set: "CollectionOf",
  Map: "MapOf"
};

interface CollectionOfDecoratorsStatus extends DecoratorsStatus<DECORATORS_TYPES> {
  isCollection: boolean;
  collectionType: string;
}

const RULES_CHECK: RuleOptions<RULES, CollectionOfDecoratorsStatus>[] = [
  {
    messageId: "unexpected-map-of-decorator",
    message: "Unexpected MapOf decorator over a property not returning Map",
    test: ({decorators, isCollection, collectionType}) =>
      isCollection
      && decorators.has("MapOf") && collectionType !== "Map",
    *fix({fixer, node}) {
      const {itemType, collectionType} = getTypes(node);
      const collectionOfDecorator = findPropertyDecorator(node, "MapOf");
      const decoratorName = TYPES_TO_DECORATORS[collectionType as string];

      yield* addImportSpecifier(node, fixer, "@tsed/schema", decoratorName!);

      yield fixer.replaceText(collectionOfDecorator!, `@${decoratorName}(${itemType})\n${getWhiteSpaces(node)}`);
    }
  },
  {
    messageId: "missing-collection-of-decorator",
    message: "Property returning Array, Set or Map must set CollectionOf decorator",
    test: ({decorators, isCollection}) =>
      isCollection && !(decorators.has("CollectionOf") || decorators.has("MapOf") || decorators.has("ArrayOf") || decorators.has("Enum")),
    * fix({fixer, node, decoratorsStatus}) {
      const {itemType, collectionType} = getTypes(node);
      const decoratorName = TYPES_TO_DECORATORS[collectionType as string];

      yield* addImportSpecifier(node, fixer, "@tsed/schema", decoratorName!);
      yield fixer.insertTextBefore(node, `@${decoratorName}(${itemType})\n${getWhiteSpaces(node)}`);
    }
  },
  {
    messageId: "unnecessary-collection-of-decorator",
    message: "Unnecessary CollectionOf decorator over a Property not returning Array, Set or Map",
    test: ({decorators, isCollection}) =>
      !isCollection
      && decorators.has("CollectionOf"),
    fix({fixer, node}) {
      const collectionOfDecorator = findPropertyDecorator(node, "CollectionOf");

      return collectionOfDecorator ? fixer.remove(collectionOfDecorator) : null;
    }
  },
  {
    messageId: "unnecessary-array-of-decorator",
    message: "Unnecessary ArrayOf decorator over a Property not returning Array",
    test: ({decorators, isCollection}) =>
      decorators.has("ArrayOf") &&
      (!isCollection || (isCollection && decorators.has("Enum"))),
    fix({fixer, node}) {
      const collectionOfDecorator = findPropertyDecorator(node, "ArrayOf");

      return collectionOfDecorator ? fixer.remove(collectionOfDecorator) : null;
    }
  },
  {
    messageId: "unnecessary-map-of-decorator",
    message: "Unnecessary MapOf decorator over a Property not returning Map",
    test: ({decorators, isCollection}) =>
      !isCollection
      && decorators.has("MapOf"),
    fix({fixer, node}) {
      const collectionOfDecorator = findPropertyDecorator(node, "MapOf");

      return collectionOfDecorator ? fixer.remove(collectionOfDecorator) : null;
    }
  },
  {
    messageId: "unnecessary-property-of-decorator",
    message: "Unnecessary Property decorator over a Property returning Array, Set or Map",
    test: ({decorators, isCollection}) =>
      isCollection
      && decorators.has("Property"),
    fix({fixer, node}) {
      const propertyDecorator = findPropertyDecorator(node, "Property");

      return propertyDecorator ? fixer.remove(propertyDecorator) : null;
    }
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

      let type = AST_NODE_TYPES.TSArrayType === node.typeAnnotation?.typeAnnotation?.type as AST_NODE_TYPES.TSArrayType ? "Array" :
        (node.typeAnnotation?.typeAnnotation as any | undefined)?.typeName?.name;

      decoratorsStatus.isCollection = ["Array", "Map", "Set"].includes(type);
      decoratorsStatus.collectionType = type;

      RULES_CHECK
        .some(({messageId, test, fix}) => {
          if (test(decoratorsStatus)) {
            context.report({
              node,
              messageId,
              fix: fix && ((fixer) => fix({fixer, node, decoratorsStatus}))
            });

            return true;
          }

          return false;
        });
    }
  };
}

export const name = "explicit-collection-of-decorator";
export const rule = createRule<[], RULES>({
  name,
  meta: {
    docs: {
      description: "Property returning array must set CollectionOf decorator",

      requiresTypeChecking: false
    },
    messages: createMessages<RULES>(RULES_CHECK),
    schema: [],
    hasSuggestions: false,
    type: "problem",
    fixable: "code"
  },
  defaultOptions: [],
  create
});

