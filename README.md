# mock-puppeteer-goto

[![CI](https://github.com/samdouble/mock-puppeteer-goto/actions/workflows/checks.yml/badge.svg)](https://github.com/samdouble/mock-puppeteer-goto/actions/workflows/checks.yml)
[![npm version](https://img.shields.io/npm/v/mock-puppeteer-goto.svg?style=flat)](https://www.npmjs.org/package/mock-puppeteer-goto)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/mock-puppeteer-goto)
[![Coverage Status](https://coveralls.io/repos/samdouble/mock-puppeteer-goto/badge.svg?branch=master&service=github)](https://coveralls.io/github/samdouble/mock-puppeteer-goto?branch=master)

A Node module to help you mock a Puppeteer page's goto method.

### Use Case
You have a Puppeteer script that you would like to test, but you do not want actual webpages to be loaded every time your tests are ran.
This module offers you a concise way to test your script against local copies of the HTML files instead of real webpages.

### Installation
```
npm install --save-dev mock-puppeteer-goto
```

### Usage
In your test, before calling the script that you want to test, call ***mock-puppeteer-goto**.
The function takes 2 arguments:
- The Puppeteer Page object your script is going to use
- A config object with the following properties:

    - **paths**: Required. An object that tells mock-puppeteer-goto how it should mock Puppeteer's goto function. The keys are the links that are going to be visited by the Puppeteer script as found in the source code of the webpage. The values are the paths to the local HTML files with which the webpages will be stubbed.
    - **throwIfNotMapped**: Optional. A boolean that tells mock-puppeteer-goto to throw an error if your script is trying to visit a page that is not specified in your **paths** object. Defaults to false.

After your test, restore the normal behavior of Puppeteer's goto function to avoid any weird results in some of your other tests.

Here is a small example on how to use the module in your test files with Puppeteer:

```javascript
const mockPuppeteerGoto = require('mock-puppeteer-goto');

describe('My Puppeteer script', () => {
  it('Should return an array of trucks and for each, a list of their engines', async () => {
    // Create your Puppeteer Page
    // Use mock-puppeteer-goto to remap the pages your script will visit
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const mock = mockPuppeteerGoto(page, {
      paths: {
        'https://somewebsite.com/': './tests/main.html',
        'https://somewebsite.com/f150.html': './tests/f150.html',
        'https://somewebsite.com/silverado.html': './tests/silverado.html',
        'https://somewebsite.com/ram.html': './tests/ram.html',
      },
    });

    // Call the Puppeteer script that you want to test.
    const results = await myPuppeteerFunction(page);

    // Close the Browser since you don't need it anymore
    // and restore Puppeteer's goto function
    await browser.close();
    mock.restore();

    // ...
    // Assertions on results
    // ...
  });
});
```

It works with Playwright too.
