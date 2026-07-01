# mock-goto

A module to mock a Playwright or Puppeteer page's goto method.

[![CI](https://github.com/samdouble/mock-goto/actions/workflows/checks.yml/badge.svg)](https://github.com/samdouble/mock-goto/actions/workflows/checks.yml)
[![Coverage Status](https://coveralls.io/repos/github/samdouble/mock-goto/badge.svg?branch=master)](https://coveralls.io/github/samdouble/mock-goto?branch=master)
[![npm version](https://img.shields.io/npm/v/mock-goto.svg?style=flat)](https://www.npmjs.org/package/mock-goto)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/mock-goto)

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Playwright](https://custom-icon-badges.demolab.com/badge/Playwright-2EAD33?logo=playwright&logoColor=fff)](https://playwright.dev/)
[![Puppeteer](https://custom-icon-badges.demolab.com/badge/Puppeteer-40B5A4?logo=puppeteer&logoColor=fff)](https://pptr.dev/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff)](https://jestjs.io/)
[![Mocha](https://img.shields.io/badge/Mocha-8D6748?logo=mocha&logoColor=fff)](https://mochajs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](https://www.npmjs.com/)

### Use Case

You have a Playwright or Puppeteer script that you would like to test, but you do not want actual webpages to be loaded every time your tests are ran.
This module offers you a concise way to test your script against local copies of the HTML files instead of real webpages.

### Installation

```
npm install --save-dev mock-goto
```

### Usage

In your tests, call **mock-goto** before calling the script that you want to test.
It is a function that takes 2 arguments:

- The Playwright/Puppeteer Page object the script is using
- A config object with the following properties:

    - **paths**: Required. An object that tells mock-goto how it should mock the `goto` function. The keys are the links that are going to be visited by the script as found in the source code of the webpage. The values are the paths to the local HTML files with which the webpages will be stubbed.
    - **throwIfNotMapped**: Optional. A boolean that tells mock-goto to throw an error if your script is trying to visit a page that is not specified in your **paths** object. Defaults to false.

After testing, restore the normal behavior of the `goto` function to avoid any weird results in other tests.

#### Example with Playwright

```javascript
const mockGoto = require('mock-goto');

describe('My script', () => {
  it('Should return an array of trucks and for each, a list of their engines', async () => {
    // Create a Playwright Page and use mock-goto to remap the pages your script will visit
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const mock = mockGoto(page, {
      paths: {
        'https://somewebsite.com/': './tests/main.html',
        'https://somewebsite.com/f150.html': './tests/f150.html',
        'https://somewebsite.com/silverado.html': './tests/silverado.html',
        'https://somewebsite.com/ram.html': './tests/ram.html',
      },
    });

    // Call the script that you want to test.
    const results = await myScript(page);

    // Close the Browser since you don't need it anymore
    // and restore the `goto` function
    await browser.close();
    mock.restore();

    // ...
    // Assertions on results
    // ...
  });
});
```
#### Example with Puppeteer

```javascript
const mockGoto = require('mock-goto');

describe('My script', () => {
  it('Should return an array of trucks and for each, a list of their engines', async () => {
    // Create a Puppeteer Page and use mock-goto to remap the pages your script will visit
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const mock = mockGoto(page, {
      paths: {
        'https://somewebsite.com/': './tests/main.html',
        'https://somewebsite.com/f150.html': './tests/f150.html',
        'https://somewebsite.com/silverado.html': './tests/silverado.html',
        'https://somewebsite.com/ram.html': './tests/ram.html',
      },
    });

    // Call the script that you want to test.
    const results = await myScript(page);

    // Close the Browser since you don't need it anymore
    // and restore the `goto` function
    await browser.close();
    mock.restore();

    // ...
    // Assertions on results
    // ...
  });
});
```
