import {RuleTester} from "@typescript-eslint/rule-tester";
import {name, rule} from "./explicitCollectionOfDecorator";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser"
});

describe("explicitCollectionOfDecorator", () => {
  ruleTester.run(name, rule, {
    valid: [
      {
        code: `
        import {CollectionOf} from "@tsed/schema";
        export class TestClass {
          @CollectionOf(String)
          thisIsAStringProp?: string[];
        }`,
      },
      {
        code: `
        import {CollectionOf} from "@tsed/schema";
        class TestClass {
          @CollectionOf(String)
          thisIsAStringProp?: Array<string>;
        }`,
      },
      {
        code: `
        import {CollectionOf} from "@tsed/schema";
        class TestClass {
          @CollectionOf(String)
          thisIsAStringProp?: Map<string, string>;
        }`,
      },
      {
        code: `
        import {CollectionOf} from "@tsed/schema";
        class TestClass {
          @CollectionOf(String)
          thisIsAStringProp?: Set<string>;
        }`,
      },
      {
        code: `
        class TestClass {
          thisIsABooleanProp = false
        }`,
      },
      {
        code: `
        import {Property} from "@tsed/schema";
        class TestClass {
          @Property()
          thisIsABooleanProp = false
        }`,
      }
    ],
    invalid: [
      {
        code: `
          import {CollectionOf, Property} from "@tsed/schema";
          class TestClass {
            @Property()
            @CollectionOf(String)
            thisIsAStringProp?: string[];
          }`,
        errors: [
          {
            messageId: "unnecessary-property-of-decorator",
          },
        ],
        output: `
          import {CollectionOf, Property} from "@tsed/schema";
          class TestClass {
            
            @CollectionOf(String)
            thisIsAStringProp?: string[];
          }`
      },
      {
        code: `
          import {ArrayOf, Property} from "@tsed/schema";
          class TestClass {
            @Property()
            @ArrayOf(String)
            thisIsAStringProp?: string[];
          }`,
        errors: [
          {
            messageId: "unnecessary-property-of-decorator",
          },
        ],
        output: `
          import {ArrayOf, Property} from "@tsed/schema";
          class TestClass {
            
            @ArrayOf(String)
            thisIsAStringProp?: string[];
          }`
      },
      {
        code: `
          import {MapOf, Property} from "@tsed/schema";
          class TestClass {
            @Property()
            @MapOf(String)
            thisIsAStringProp?: Map<string, string>;
          }`,
        errors: [
          {
            messageId: "unnecessary-property-of-decorator",
          },
        ],
        output: `
          import {MapOf, Property} from "@tsed/schema";
          class TestClass {
            
            @MapOf(String)
            thisIsAStringProp?: Map<string, string>;
          }`
      },
      {
        code: `
          import {CollectionOf} from "@tsed/schema";
          class TestClass {
             @CollectionOf(String)
             thisIsAStringProp?: string;
          }`,
        errors: [
          {
            messageId: "unnecessary-collection-of-decorator",
          },
        ],
        output: `
          import {CollectionOf} from "@tsed/schema";
          class TestClass {
             
             thisIsAStringProp?: string;
          }`,
      },
      {
        code: `
          import {Property} from "@tsed/schema";
          class TestClass {
            @Property()
            thisIsAStringProp?: string[]
          }`,
        errors: [
          {
            messageId: "missing-collection-of-decorator",
          },
        ],
        output: `
          import {Property, ArrayOf} from "@tsed/schema";
          class TestClass {
            @ArrayOf(String)
            thisIsAStringProp?: string[]
          }`
      },
      {
        code: `
        import {MinItems} from "@tsed/schema";
        export class TestClass {
          @MinItems(1)
          thisIsAStringProp?: string[];
        }`,
        errors: [
          {
            messageId: "missing-collection-of-decorator",
          },
        ],
        output: `
        import {MinItems, ArrayOf} from "@tsed/schema";
        export class TestClass {
          @ArrayOf(String)
          @MinItems(1)
          thisIsAStringProp?: string[];
        }`
      },
      {
        code: `
        import {MinItems} from "@tsed/schema";
        export class TestClass {
          @MinItems(1)
          thisIsAStringProp?: Set<string>;
        }`,
        errors: [
          {
            messageId: "missing-collection-of-decorator",
          },
        ],
        output: `
        import {MinItems, CollectionOf} from "@tsed/schema";
        export class TestClass {
          @CollectionOf(String)
          @MinItems(1)
          thisIsAStringProp?: Set<string>;
        }`,
      },
      {
        code: `
        import {MinItems} from "@tsed/schema";
        export class TestClass {
          @MinItems(1)
          thisIsAStringProp?: Map<string, string>;
        }`,
        errors: [
          {
            messageId: "missing-collection-of-decorator",
          },
        ],
        output: `
        import {MinItems, MapOf} from "@tsed/schema";
        export class TestClass {
          @MapOf(String)
          @MinItems(1)
          thisIsAStringProp?: Map<string, string>;
        }`,
      },
    ],
  });
});
