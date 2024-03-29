import {ESLintUtils, TSESLint, TSESTree} from "@typescript-eslint/utils";
import {RuleFix} from "@typescript-eslint/utils/ts-eslint";
import {DecoratorsStatus} from "./getDecoratorsStatus.js";

export interface RuleOptions<RULES extends string, DecoratorsStatus> {
  messageId: RULES;
  message: string;

  test(opts: DecoratorsStatus): boolean;
  fix?(fixer: TSESLint.RuleFixer, node: TSESTree.PropertyDefinition, decoratorsStatus: DecoratorsStatus): IterableIterator<RuleFix> | RuleFix | readonly RuleFix[] | null;
}

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/tsedio/eslint-plugin-tsed/blob/main/docs/rules/${name}.md`
);

export function createMessages<RULES extends string, DS extends DecoratorsStatus<RULES> = DecoratorsStatus<any>> (RULES_CHECK: RuleOptions<RULES, DS>[]) {
  return Object.fromEntries(RULES_CHECK.map(({message, messageId}) => {
    return [messageId, message];
  })) as Record<RULES, string>;
}
