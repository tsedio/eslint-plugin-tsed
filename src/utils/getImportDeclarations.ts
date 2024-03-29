import {getRootProgram} from "./getRootProgram";
import {TSESTree} from "@typescript-eslint/utils";

export function getImportDeclarations(node: TSESTree.BaseNode) {
  const rootProgram = getRootProgram(node);

  if (rootProgram) {
    return rootProgram.body.filter((node) => {
      return node.type === TSESTree.AST_NODE_TYPES.ImportDeclaration;
    }) as TSESTree.ImportDeclaration[];
  }

  return [];
}

export function getImportDeclaration(node: TSESTree.BaseNode, pkg: string) {
  return getImportDeclarations(node).find((importStatement) => {
    return importStatement.source.value === pkg;
  });
}


export function hasImportedSpecifier(importStatement: TSESTree.ImportDeclaration, token: string) {
  return importStatement.specifiers.some((specifier) => {
    return specifier.local.name === token;
  });
}


