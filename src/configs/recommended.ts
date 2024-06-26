import * as explicitCollectionOfDecorator
  from "../rules/explicit-collection-of-decorator/explicitCollectionOfDecorator";
import * as explicitRequiredDecorator from "../rules/explicit-required-decorator/explicitRequiredDecorator";
import * as noDuplicateDecorators from "../rules/no-duplicate-decorators/noDuplicateDecorators";
import * as unusedImportedSpecifier from "../rules/unused-imported-specifier/unusedImportedSpecifier";

export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {sourceType: "module"},
  rules: {
    [`@tsed/${explicitCollectionOfDecorator.name}`]: "error",
    [`@tsed/${explicitRequiredDecorator.name}`]: "error",
    [`@tsed/${noDuplicateDecorators.name}`]: "error",
    [`@tsed/${unusedImportedSpecifier.name}`]: "error",
  },
};
