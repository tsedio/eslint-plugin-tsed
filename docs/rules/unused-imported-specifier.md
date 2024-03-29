# Rule: unused-imported-specifier

This rule checks that you are not importing a module and not using any of its exports 
for all `@tsed` packages.

## Configuration
## Usage

✅ This PASSES - when decorator are used in the code

```ts
import { Required } from '@tsed/schema';

class MyClass {
  @Required()
  myProperty: string;
}
```

❌ This FAILS - when decorator is not used in the code

```ts
import { Required, Property } from '@tsed/schema';

class MyClass {
  @Property()
  myProperty: string;
}
```
