import {getImportDeclaration, hasImportedSpecifier} from "./getImportDeclarations";
import {TSESLint, TSESTree} from "@typescript-eslint/utils";

const weakMap = new WeakMap();

export function* addImportSpecifier(node: TSESTree.BaseNode, fixer: TSESLint.RuleFixer, pkg: string, token: string) {
  const importStatement = getImportDeclaration(node, pkg);

  if (importStatement) {
    if (weakMap.has(importStatement)) {
      if (weakMap.get(importStatement).has(token)) {
        return;
      }
    }

    if (!hasImportedSpecifier(importStatement, token)) {
      weakMap.set(importStatement,
        (weakMap.get(importStatement) || new Set).add(token)
      );

      yield fixer.insertTextAfter(importStatement.specifiers.at(-1)!, ", " + token);
    }
  }
}
