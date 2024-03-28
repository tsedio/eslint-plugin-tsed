import {TSESTree} from "@typescript-eslint/utils";

export const typedTokenHelpers = {
  /**
   * Checks if an import is an import of the given decorator name
   * @param imp
   * @param decoratorName
   */
  importIsDecorator(
    imp: TSESTree.ImportDeclaration,
    decoratorName: string,
  ): boolean {
    const isFromClassValidator = imp.source.value.startsWith("@tsed/schema");
    const isDecoratorImport = imp.specifiers.some(
      (specifier) => specifier.local.name === decoratorName,
    );

    return isFromClassValidator && isDecoratorImport;
  },
  /**
   * Checks if decorator is in imports of a node
   * @param imports
   * @param decorator
   */
  decoratorIsImportedFromTsEDSchema(
    imports: TSESTree.ImportDeclaration[],
    decorator: TSESTree.Decorator,
  ): boolean {
    const decoratorName = this.getDecoratorName(decorator);

    if (!decoratorName) {
      return false;
    }

    return imports.some((imp) =>
      typedTokenHelpers.importIsDecorator(imp, decoratorName),
    );
  },
  /**
   * Checks whether a decorator is a class validator decorator
   * @param program The root program node
   * @param decorator The decorator node
   */
  decoratorIsTsEDSchemaDecorator(
    program: TSESTree.Program | null,
    decorator: TSESTree.Decorator,
  ): boolean {
    if (!program) {
      return false;
    }

    const imports = program.body.filter(
      (node): node is TSESTree.ImportDeclaration =>
        node.type === TSESTree.AST_NODE_TYPES.ImportDeclaration,
    );

    return typedTokenHelpers.decoratorIsImportedFromTsEDSchema(
      imports,
      decorator,
    );
  },
  /**
   * Gets the root program of a node
   * @param node
   */
  getRootProgram(node: TSESTree.BaseNode): TSESTree.Program | null {
    let root = node;

    while (root.parent) {
      if (root.parent.type === TSESTree.AST_NODE_TYPES.Program) {
        return root.parent;
      }

      root = root.parent;
    }

    return null;
  },
  /**
   * Gets all the decorators actually imported from @tsed/schema lib or decorators that were included in the additionalCustomValidatorDecorators options
   * @param node PropertyDefinition node
   * @param additionalCustomValidatorDecorators
   */
  getValidationDecorators(
    node: TSESTree.PropertyDefinition,
    additionalCustomValidatorDecorators: string[] = [],
  ): TSESTree.Decorator[] {
    const program = typedTokenHelpers.getRootProgram(node);

    const {decorators} = node;

    return (
      decorators?.filter((decorator): decorator is TSESTree.Decorator => {
        const isClassValidatorDecorator =
          typedTokenHelpers.decoratorIsTsEDSchemaDecorator(
            program,
            decorator,
          );

        const decoratorName = typedTokenHelpers.getDecoratorName(decorator);

        const isCustomClassValidatorDecorator =
          decoratorName === null
            ? false
            : additionalCustomValidatorDecorators.includes(decoratorName);

        return isCustomClassValidatorDecorator || isClassValidatorDecorator;
      }) ?? []
    );
  },
  /**
   * Gets the name of a decorator
   * Returns null if no name is found
   * @param decorator
   */
  getDecoratorName(decorator: TSESTree.Decorator): string | null {
    if (decorator.expression.type !== TSESTree.AST_NODE_TYPES.CallExpression) {
      return null;
    }

    if (
      decorator.expression.callee.type !== TSESTree.AST_NODE_TYPES.Identifier
    ) {
      return null;
    }

    return decorator.expression.callee.name;
  },
};
