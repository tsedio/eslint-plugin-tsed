import {RuleTester} from "@typescript-eslint/rule-tester";
import {name, rule} from "./explicitRequiredDecorator";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser"
});

describe("explicitRequiredDecorator", () => {
  ruleTester.run(name, rule, {
    valid: [
      {
        code: `
          class A {
            @A
            b: string
          }`
      },
      {
        code: `
          class A {
            @A()
            b: string
          }`
      },
      {
        code: `
          class A {
            b: string
          }`
      },
      {
        code: `
            import { Required } from '@tsed/schema';
            class A {
              @Required()
              b: string
              
              @Required()
              c: string
            }`
      },
      {
        code: `
            import { Property, Required } from '@tsed/schema';
            class A {
              @Property()
              @Required()
              b: number
              
              @Required()
              c: string
            }`
      },
      {
        code: `
            import { Property, Optional, Property } from '@tsed/schema';
            class A {
              @Property()
              @Optional()
              b?: number
            
              @Required()
              c: string
            }`
      },
      {
        code: `
            import { Property, Optional, Property } from '@tsed/schema';
            class A {
              @Property()
              @Optional()
              b?: number
            
              @Property()
              @Optional()
              c?: string
            }`
      },

      {
        code: `
          import { Property, Optional, Property, RequiredIf } from '@tsed/schema';
          class A {
            @Property()
            @Optional()
            b?: number
          
            @RequiredIf((o) => !o.b)
            @Property()
            c?: string
          }`
      },
      {
        code: `
            import { Required } from '@tsed/schema';
            class A {
              @Required()
              b: string
            
              c?: string
            }`
      },
      {
        code: `
            import { Optional } from '@tsed/schema';
            class A {
              @Optional()
              b?: string
            
              c: string
            }`
      }
    ],
    invalid: [
      {
        code: `
            import { Optional } from '@tsed/schema';
            class A {
              @Optional()
              b: string
            }`,
        errors: [
          {
            messageId: "missing-required-decorator"
          }
        ],
        output: `
            import { Optional, Required } from '@tsed/schema';
            class A {
              @Required()
              b: string
            }`
      },
      {
        code: `
            import { Optional } from '@tsed/schema';
            class A {
              @Optional()
              a: string
              
              @Optional()
              b: string
            }`,
        errors: [
          {
            messageId: "missing-required-decorator"
          },
          {
            messageId: "missing-required-decorator"
          }
        ],
        output: `
            import { Optional, Required } from '@tsed/schema';
            class A {
              @Required()
              a: string
              
              @Required()
              b: string
            }`
      },
      {
        code: `
            import { Property } from '@tsed/schema';
            class A {
              @Property()
              b: string
            }`,
        errors: [
          {
            messageId: "missing-required-decorator"
          }
        ],
        output: `
            import { Property, Required } from '@tsed/schema';
            class A {
              @Required()
              @Property()
              b: string
            }`
      },
      {
        code: `
            import { Required } from '@tsed/schema';
            class A {
              @Required()
              b?: string
            }`,
        errors: [
          {
            messageId: "missing-optional-decorator"
          }
        ],
        output: `
            import { Required, Optional } from '@tsed/schema';
            class A {
              @Optional()
              b?: string
            }`
      },
      {
        code: `
            import { Property } from '@tsed/schema';
            class A {
              @Property()
              b?: string
            }`,
        errors: [
          {
            messageId: "missing-optional-decorator"
          }
        ],
        output: `
            import { Property, Optional } from '@tsed/schema';
            class A {
              @Optional()
              @Property()
              b?: string
            }`
      },
      {
        code: `
            import { Optional, Required } from '@tsed/schema';
            class A {
              @Required()
              @Optional()
              b?: string
            }`,
        errors: [
          {
            messageId:
              "conflicting-decorators-required-optional"
          }
        ],
        output: `
            import { Optional, Required } from '@tsed/schema';
            class A {
              
              @Optional()
              b?: string
            }`,
      },
      {
        code: `
            import { RequiredIf, Required } from '@tsed/schema';
            class A {
              @Required()
              @RequiredIf()
              b?: string
            }`,
        errors: [
          {
            messageId:
              "conflicting-decorators-required-required-if"
          }
        ]
      },
      {
        code: `
            import { RequiredIf, Optional } from '@tsed/schema';
            class A {
              @Optional()
              @RequiredIf()
              b?: string
            }
    `,
        errors: [
          {
            messageId:
              "conflicting-decorators-optional-required-if"
          }
        ]
      },
      {
        code: `
            import { RequiredIf, Optional, Required } from '@tsed/schema';
            class A {
              @Required()
              @Optional()
              @RequiredIf()
              b?: string
            }`,
        errors: [
          {
            messageId: "conflicting-decorators-all"
          }
        ]
      }
    ]
  })
});
