# Rule: explicit-collection-of-decorator

If you return an Array, Set or Map you should indicate that the property is collection of Array, Set or Map.

Ts.ED provide decorators for each type of collection:

- Array: `@ArrayOf()`,
- Map: `@MapOf()`,
- Set: `@CollectionOf()`.

## Usage

✅ This PASSES - property is Array and ArrayOf is used:

```ts
import {ArrayOf} from "@tsed/schema";

class TestClass {
  @ArrayOf(String)
  thisIsAProp!: String[];
}
```

✅ This PASSES - property is Array and ArrayOf is used:

```ts
import {ArrayOf} from "@tsed/schema";

class TestClass {
  @ArrayOf(String)
  thisIsAProp!: Array<string>;
}
```

✅ This PASSES - property is Map and MapOf is used:

```ts
import {MapOf} from "@tsed/schema";

class TestClass {
  @MapOf(String)
  thisIsAProp!: Map<string, string>;
}
```

✅ This PASSES - property is Set and Collection is used:

```ts
import {CollectionOf} from "@tsed/schema";

class TestClass {
  @MapOf(String)
  thisIsAProp!: Set<string>;
}
```

❌ This FAILS - when ArrayOf or CollectionOf is missing:

```ts
import {Property} from "@tsed/schema";

class TestClass {
  @Property()
  thisIsAProp!: Array<string>;
}
```

❌ This FAILS - when ArrayOf or CollectionOf is missing:

```ts
import {MinItems} from "@tsed/schema";

class TestClass {
  @MinItems(1)
  thisIsAProp!: Array<string>;
}
```

❌ This FAILS - when Property and CollectionOf is used on the same property:

```ts
import {Property} from "@tsed/schema";

class TestClass {
  @Property()
  @CollectionOf(String)
  thisIsAProp!: Array<string>;
}
```

❌ This FAILS - when the CollectionOf, MapOf or ArrayOf is used on a property that is not a collection:

```ts
import {CollectionOf} from "@tsed/schema";

class TestClass {
  @CollectionOf(String)
  thisIsAProp!: string;
}
```
