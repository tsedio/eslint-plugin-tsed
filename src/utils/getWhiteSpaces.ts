import {TSESTree} from "@typescript-eslint/utils";

export function getWhiteSpaces(node: TSESTree.Node) {
  return new Array(node.loc.start.column).fill(" ").join("");
}
