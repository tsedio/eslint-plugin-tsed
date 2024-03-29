import {TSESTree} from "@typescript-eslint/utils";
import {createMessages, createRule, RuleOptions} from "../../utils/createRule";
import {RuleContext, RuleRecommendation} from "@typescript-eslint/utils/ts-eslint";
import {DecoratorsStatus, getDecoratorsStatus} from "../../utils/getDecoratorsStatus";

type DECORATORS_TYPES = "Required" | "Optional" | "RequiredIf";
const DECORATORS: DECORATORS_TYPES[] = ["Required", "Optional", "RequiredIf"];

interface RequiredDecoratorsStatus extends DecoratorsStatus<DECORATORS_TYPES> {
  isOptional: boolean;
}

type RULES = | "missing-is-defined-decorator"
  | "missing-is-optional-decorator"
  | "conflicting-defined-decorators-defined-optional"
  | "conflicting-defined-decorators-defined-required-if"
  | "conflicting-defined-decorators-optional-required-if"
  | "conflicting-defined-decorators-all"

const RULES_CHECK: RuleOptions<RULES, RequiredDecoratorsStatus>[] = [
  {
    messageId: "conflicting-defined-decorators-all",
    message: "Properties can have one of @Required() or @Optional() or @RequiredIf()",
    test: ({
             decorators
           }) =>
      decorators.has("Required")
      && decorators.has("Optional")
      && decorators.has("RequiredIf")
  },
  {
    messageId: "conflicting-defined-decorators-defined-optional",
    message: "Properties can have @Required() or @Optional() but not both",
    test: ({decorators}) =>
      decorators.has("Required")
      && decorators.has("Optional")
  },

  {
    messageId: "conflicting-defined-decorators-defined-required-if",
    message: "Properties can have @Required() or @RequiredIf() but not both",
    test: ({decorators}) =>
      decorators.has("Required")
      && decorators.has("RequiredIf")
  },

  {
    messageId: "conflicting-defined-decorators-optional-required-if",
    message: "Properties can have @Optional() or @RequiredIf() but not both",
    test:
      ({decorators}) =>
        decorators.has("Optional")
        && decorators.has("RequiredIf")
  },
  {
    messageId: "missing-is-optional-decorator",

    message: "Optional properties must have @Optional() or @RequiredIf() decorator",
    test: ({decorators, isOptional}) =>
      isOptional
      && !decorators.has("Optional")
      && !decorators.has("RequiredIf")
  },
  {
    messageId: "missing-is-defined-decorator",
    message: "Non-optional properties must have a decorator that checks the value is defined (for example: @Required())",
    test: ({decorators, isOptional}) =>
      !isOptional
      && !decorators.has("Required")
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

      decoratorsStatus.isOptional = Boolean(node.optional)

      RULES_CHECK
        .some(({messageId, test}) => {
          if (test(decoratorsStatus)) {
            context.report({
              node: node,
              messageId
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
    schema: []
  },
  defaultOptions: [],
  create
});
