<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <hr />

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed-eslint-plugin/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed-eslint-plugin/blob/main/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Feslint-plugin)
![npm-tag](https://badgen.net/github/tag/tsedio/eslint-plugin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)
![commit](https://badgen.net/github/last-commit/@tsed/eslint-plugin/main)
![size](https://badgen.net/bundlephobia/minzip/@tsed/eslint-plugin?color=cyan)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />


## A note on versions

-   Version `5.x` supports Eslint version `>=8.x` and typescript eslint parser `^7`
-   Version `4.x` supports Eslint version `>=8.x` and typescript eslint parser `^6`
-   Version `3.x` supports Eslint version `>=8.x` and typescript eslint parser `^5`
-   Version `2.x` supports Eslint version `<=7.x` and typescript eslint parser `^4`

There are breaking changes between versions ofr ts-eslint.

typescript eslint parser supports a range of typescript versions but there can be a delay in supporting the latest versions.

This plugin only supports typescript up to the version typescript eslint parser supports. See https://github.com/typescript-eslint/typescript-eslint#supported-typescript-version for the versions.

## Have an idea for a rule?

Awesome! [Click here](https://github.com/darraghoriordan/eslint-plugin-nestjs-typed/issues/new?title=New%20Rule%20Suggestion&labels=Rule%20Suggestion&body=Hi!%20I%20have%20an%20idea%20for%20a%20rule...) to submit a new issue!

## Index of available rules

| Category        | Rule                                                                              | is on in recommended ruleset? |
|-----------------|-----------------------------------------------------------------------------------|-------------------------------|
| Preventing Bugs | [`explicit-required-decorator`](./docs/rules/explicit-required-decorator.md)      | ✅                             |
|                 | [`explicit-collection-of-decorator`](./docs/rules/explicit-required-decorator.md) | ✅                             |
|                 | [`no-duplicate-decorators`](./docs/rules/explicit-required-decorator.md)          | ✅                             |

The "recommended" ruleset are the default rules that are turned on when you configure the plugin as described in this document.

The name "recommended" is an eslint convention. Some rules in this plugin are opinionated and have to be turned on explicitly in your eslintrc file.

## Who is this package for?

If you use Ts.ED (https://tsed.io/) these ESLint rules will help you to prevent common bugs and issues in Ts.ED applications.

They mostly check that you are using decorators correctly.

## To install

The plugin is on npm here: https://www.npmjs.com/package/@tsed/eslint-plugin

```sh
npm install --save-dev @tsed/eslint-plugin

// or

yarn add -D @tsed/eslint-plugin
// or

pnpm add -D @tsed/eslint-plugin
```

## To configure

Update your eslint with the plugin import and add the recommended rule set

```ts
module.exports = {
  env: {
    es6: true,
  },
  extends: ["plugin:@tsed/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    sourceType: "module",
    ecmaVersion: "es2019",
  },
  plugins: ["@tsed"],
};
```

## Contributors

Please read [contributing guidelines here](./CONTRIBUTING.md).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2024 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
