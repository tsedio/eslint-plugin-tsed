import * as explicitRequiredDecorator from "./explicit-required-decorator/explicitRequiredDecorator";
import * as explicitCollectionOfDecorator from "./explicit-collection-of-decorator/explicitCollectionOfDecorator";
import * as noDuplicateDecorators from "./no-duplicate-decorators/noDuplicateDecorators";

const allRules = {
  [explicitCollectionOfDecorator.name]: explicitCollectionOfDecorator.rule,
  [explicitRequiredDecorator.name]: explicitRequiredDecorator.rule,
  [noDuplicateDecorators.name]: noDuplicateDecorators.rule,
};

export default allRules;
