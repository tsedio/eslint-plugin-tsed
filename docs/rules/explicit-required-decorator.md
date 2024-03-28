# Rule: all-properties-have-explicit-defined

This rule checks that all properties of a class have an appropriate `@Required()`, `@Optional()` or `@RequiredIf()` decorator.

This rule also checks that both `@Required()`, `@Optional()` and `@RequiredIf` are not used on the same property because this doesn't make sense.

The rule will ignore any classes that have 0 `@tsed/schema` decorators. This is to avoid errors for classes that are not used for validation.

## Usage

✅ This PASSES - all properties are decorated correctly

```ts
import {Optional, Required, RequiredIf} from "@tsed/schema";

export class CreateOrganisationDto {
  @Required()
  otherProperty!: MyClass;

  @Optional()
  someStringProperty?: string;

  @RequiredIf(o => !o.someStringProperty)
  someOtherProperty?: string;
}
```

✅ This PASSES - no `@tsed/schema` decorators are used here

```ts
export class CreateOrganisationDto {
  otherProperty!: MyClass;
  someStringProperty?: string;
}
```

❌ This FAILS - missing `@Optional()` or `RequiredIf()` on `someStringProperty`

```ts
import {Required, Property} from "@tsed/schema";

export class CreateOrganisationDto {
    @Required()
    otherProperty!: MyClass;
    
    @Property()
    someStringProperty?: string;
}
```
