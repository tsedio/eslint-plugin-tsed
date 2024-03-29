import {TSESTree} from "@typescript-eslint/utils";
import {createMessages, createRule, RuleOptions} from "../../utils/createRule";
import {RuleContext, RuleRecommendation} from "@typescript-eslint/utils/ts-eslint";
import {DecoratorsStatus, getDecoratorsStatus} from "../../utils/getDecoratorsStatus";
import {getWhiteSpaces} from "../../utils/getWhiteSpaces";
import {addImportSpecifier} from "../../utils/addImportSpecifier";

type DECORATORS_TYPES = "Required" | "Optional" | "RequiredIf";
const DECORATORS: DECORATORS_TYPES[] = ["Required", "Optional", "RequiredIf"];

interface RequiredDecoratorsStatus extends DecoratorsStatus<DECORATORS_TYPES> {
  isOptional: boolean;
}

type RULES = | "missing-required-decorator"
  | "missing-optional-decorator"
  | "conflicting-decorators-required-optional"
  | "conflicting-decorators-required-required-if"
  | "conflicting-decorators-optional-required-if"
  | "conflicting-decorators-all"

const RULES_CHECK: RuleOptions<RULES, RequiredDecoratorsStatus>[] = [
  {
    messageId: "conflicting-decorators-all",
    message: "Properties can have one of @Required() or @Optional() or @RequiredIf()",
    test: ({
             decorators
           }) =>
      decorators.has("Required")
      && decorators.has("Optional")
      && decorators.has("RequiredIf")
  },
  {
    messageId: "conflicting-decorators-required-optional",
    message: "Properties can have @Required() or @Optional() but not both",
    test: ({decorators}) =>
      decorators.has("Required")
      && decorators.has("Optional"),
    fix({fixer, decoratorsStatus}) {
      const toBeRemoved = decoratorsStatus.isOptional ? "Required" : "Optional";
      const decorators = decoratorsStatus.decorators
        .get(toBeRemoved);

      if (decorators) {
        return fixer.remove(decorators[0]);
      }

      return null;
    }
  },

  {
    messageId: "conflicting-decorators-required-required-if",
    message: "Properties can have @Required() or @RequiredIf() but not both",
    test: ({decorators}) =>
      decorators.has("Required")
      && decorators.has("RequiredIf")
  },

  {
    messageId: "conflicting-decorators-optional-required-if",
    message: "Properties can have @Optional() or @RequiredIf() but not both",
    test:
      ({decorators}) =>
        decorators.has("Optional")
        && decorators.has("RequiredIf")
  },
  {
    messageId: "missing-optional-decorator",
    message: "Optional properties must have @Optional() or @RequiredIf() decorator",
    test: ({decorators, isOptional}) =>
      isOptional
      && !decorators.has("Optional")
      && !decorators.has("RequiredIf"),
    * fix({fixer, node, decoratorsStatus}) {
      yield* addImportSpecifier(node, fixer, "@tsed/schema", "Optional");

      const decorators = decoratorsStatus.decorators.get("Required");

      if (decorators?.length) {
        yield fixer.replaceText(decorators[0], "@Optional()");
        return;
      }

      const whitespace = getWhiteSpaces(node);

      yield fixer.insertTextBefore(node, "@Optional()\n" + whitespace);
    }
  },
  {
    messageId: "missing-required-decorator",
    message: "Non-optional properties must have a decorator that checks the value is defined (for example: @Required())",
    test: ({decorators, isOptional}) =>
      !isOptional
      && !decorators.has("Required"),
    * fix({fixer, node, decoratorsStatus}) {
      yield* addImportSpecifier(node, fixer, "@tsed/schema", "Required");

      const decorators = decoratorsStatus.decorators.get("Optional");

      if (decorators?.length) {
        yield fixer.replaceText(decorators[0], "@Required()");
        return
      }

      const whitespace = getWhiteSpaces(node);
      yield fixer.insertTextBefore(node, "@Required()\n" + whitespace);
    }
  }
];


function create(context: Readonly<RuleContext<RULES, []>>) {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PropertyDefinition(node: TSESTree.PropertyDefinition) {
      // for each property in the class
      const decoratorsStatus = getDecoratorsStatus<
        DECORATORS_TYPES
      >(node, DECORATORS) as RequiredDecoratorsStatus;

      // if there is no Ts.ED decorator we don't care about this property
      if (!decoratorsStatus.hasSchemaDecorator) {
        return;
      }

      decoratorsStatus.isOptional = Boolean(node.optional);

      RULES_CHECK
        .some(({messageId, test, fix}) => {
          if (test(decoratorsStatus)) {
            context.report({
              node: node,
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

export const name = "explicit-required-decorator";
export const rule = createRule<[], RULES>({
  name,
  meta: {
    docs: {
      description:
        "Enforce all properties have an explicit defined status decorator",
      recommended: "error" as RuleRecommendation,
      requiresTypeChecking: true
    },
    messages: createMessages<RULES>(RULES_CHECK),
    type: "problem",
    fixable: "code",
    schema: []
  },
  defaultOptions: [],
  create
});
