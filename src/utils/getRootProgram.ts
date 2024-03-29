import {TSESTree} from "@typescript-eslint/utils";

export function getRootProgram(node: TSESTree.BaseNode): TSESTree.Program | null {
  let root = node;

  while (root.parent) {
    if (root.parent.type === TSESTree.AST_NODE_TYPES.Program) {
      return root.parent;
    }

    root = root.parent;
  }

  return null;
}
