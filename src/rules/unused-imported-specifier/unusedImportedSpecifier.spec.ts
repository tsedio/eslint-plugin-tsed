import {RuleTester} from "@typescript-eslint/rule-tester";
import {name, rule} from "./unusedImportedSpecifier";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser"
});

describe("unusedImportedSpecifier", () => {
  ruleTester.run(name, rule, {
    valid: [
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
            import { Optional, Required } from '@tsed/schema';
            class A {
              @Required()
              b: string
            }`,
        errors: [
          {
            messageId: "unused-imported-specifier"
          }
        ],
        output: `
            import { Required } from '@tsed/schema';
            class A {
              @Required()
              b: string
            }`
      },
      {
        code: `
            import { Required, Optional } from '@tsed/schema';
            class A {
              @Required()
              a: string
              
              @Required()
              b: string
            }`,
        errors: [
          {
            messageId: "unused-imported-specifier"
          }
        ],
        output: `
            import { Required } from '@tsed/schema';
            class A {
              @Required()
              a: string
              
              @Required()
              b: string
            }`
      },
      {
        code: `
            import { Required } from '@tsed/schema';
            class A {
              b: string
            }`,
        errors: [
          {
            messageId: "unused-imported-specifier"
          }
        ],
        output: `
            
            class A {
              b: string
            }`
      }
    ]
  })
});
