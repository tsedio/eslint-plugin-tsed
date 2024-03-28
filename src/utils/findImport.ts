import {RuleContext} from "@typescript-eslint/utils/ts-eslint";
import {AST_NODE_TYPES} from "@typescript-eslint/types";
import {TSESTree} from "@typescript-eslint/utils";

export function findImport<RULES extends string = string>(context: Readonly<RuleContext<RULES, []>>, importName: string): TSESTree.ImportDeclaration | undefined {
  return context.getSourceCode().ast.body
    .find((item) => item.type === AST_NODE_TYPES.ImportDeclaration && item.source.value === importName && item.specifiers.length) as TSESTree.ImportDeclaration | undefined;
}
