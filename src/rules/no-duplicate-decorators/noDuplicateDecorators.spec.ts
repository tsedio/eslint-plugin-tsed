import {RuleTester} from "@typescript-eslint/rule-tester";
import {getFixturesRootDirectory} from "../../testing/fixtureSetup";
import {name, rule} from "./noDuplicateDecorators";

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: "./tsconfig.json",
  },
});

describe("noDuplicateDecorators", () => {
  ruleTester.run(name, rule, {
    valid: [
      {
        code: `@Controller()
            class MyClass {
                @Controller()
                myProperty: string;

            }`,
      },
      {
        code: `@Controller()
            @NotValidated()
            @NotValidated()
            class MyClass {
                @Controller()
                myProperty: string;

            }`,
      },
    ],
    invalid: [
      {
        code: `@Controller()
        @Controller()
        class MyClass {
            @Controller()
            myProperty: string;

        }`,
        errors: [
          {
            messageId: "no-duplicate-decorators",
          },
        ]
      },
      {
        code: `
        @Controller()
        class MyClass {
            @Controller()
            @Controller()
            myProperty: string;

        }`,
        errors: [
          {
            messageId: "no-duplicate-decorators",
          },
        ],
      },
      {
        code: `
        @Controller()
        class MyClass {
            @Validated()
            @Validated()
            myProperty: string;

        }`,
        options: [{customList: ["Validated"]}],
        errors: [
          {
            messageId: "no-duplicate-decorators",
          },
        ],
        output:""
      },
    ],
  });
});
