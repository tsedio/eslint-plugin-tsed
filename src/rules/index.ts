import * as explicitRequiredDecorator from "./explicit-required-decorator/explicitRequiredDecorator";
import * as explicitCollectionOfDecorator from "./explicit-collection-of-decorator/explicitCollectionOfDecorator";
import * as noDuplicateDecorators from "./no-duplicate-decorators/noDuplicateDecorators";
import * as unusedImportedSpecifier from "./unused-imported-specifier/unusedImportedSpecifier";

const allRules = {
  [explicitCollectionOfDecorator.name]: explicitCollectionOfDecorator.rule,
  [explicitRequiredDecorator.name]: explicitRequiredDecorator.rule,
  [noDuplicateDecorators.name]: noDuplicateDecorators.rule,
  [unusedImportedSpecifier.name]: unusedImportedSpecifier.rule,
};

export default allRules;
