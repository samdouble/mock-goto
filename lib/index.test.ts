import puppeteer from 'puppeteer';
import { chromium } from 'playwright';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mockGoto from '.';
import myScript from '../tests/myScript';

chai.use(chaiAsPromised);
const { expect } = chai;

const expectedResults = [
  {
    name: 'Ford F150',
    engines: [
      '3.3-liter V-6: 290 hp, 265 lb-ft',
      '2.7-liter V-6: 325 hp, 400 lb-ft',
      '5.0-liter V-8: 400 hp, 410 lb-ft',
      '3.5-liter V-6: 400 hp, 500 lb-ft',
      '3.0-liter V-6, diesel: 250 hp, 440 lb-ft',
      '3.5-liter V-6, hybrid: 430 hp, 570 lb-ft',
    ],
  },
  {
    name: 'Chevrolet Silverado',
    engines: [
      '4.3-liter V-6: 285 hp, 305 lb-ft',
      '5.3-liter V-8: 355 hp, 383 lb-ft',
      '2.7-liter I-4: 310 hp, 348 lb-ft',
      '6.2-liter V-8: 420 hp, 460 lb-ft',
      '3.0-liter I-6, diesel: 277 hp, 460 lb-ft',
    ],
  },
  {
    name: 'Dodge Ram 1500',
    engines: [
      '3.6-liter V-6 w/ eTorque: 305 hp, 269 lb-ft',
      '3.0-liter V-6, diesel: 260 hp, 480 lb-ft',
      '5.7-liter V-8 w/ or w/o eTorque: 395 hp, 410 lb-ft',
    ],
  },
];

const pathsObject = {
  'https://somewebsite.com/': './tests/main.html',
  'https://somewebsite.com/f150.html': './tests/f150.html',
  'https://somewebsite.com/silverado.html': './tests/silverado.html',
  'https://somewebsite.com/ram.html': './tests/ram.html',
};

const pathsArray = [
  {
    url: 'https://somewebsite.com/',
    htmlPath: './tests/main.html',
  },
  {
    url: 'https://somewebsite.com/f150.html',
    htmlPath: './tests/f150.html',
  },
  {
    url: 'https://somewebsite.com/silverado.html',
    htmlPath: './tests/silverado.html',
  },
  {
    url: 'https://somewebsite.com/ram.html',
    htmlPath: './tests/ram.html',
  },
];

const partialPathsArray = [
  {
    url: 'https://somewebsite.com/',
    htmlPath: './tests/main.html',
  },
  {
    url: 'https://somewebsite.com/f150.html',
    htmlPath: './tests/f150.html',
  },
  {
    url: 'https://somewebsite.com/ram.html',
    htmlPath: './tests/ram.html',
  },
];

interface BrowserSession {
  page: {
    goto: (url: string) => Promise<unknown>;
    setContent: (html: string) => Promise<void>;
    evaluate: <T>(pageFunction: () => T | Promise<T>) => Promise<T>;
  };
  close: () => Promise<void>;
}

function registerTests(launchSession: () => Promise<BrowserSession>) {
  it('Should work properly with a key-value config object', async () => {
    const { page, close } = await launchSession();
    const mock = mockGoto(page, { paths: pathsObject });
    const scriptResults = await myScript(page);
    await close();
    mock.restore();
    expect(scriptResults).to.be.an('array');
    expect(scriptResults).to.have.length(3);
    expect(scriptResults).to.deep.equal(expectedResults);
  });

  it('Should work properly with an array config object', async () => {
    const { page, close } = await launchSession();
    const mock = mockGoto(page, { paths: pathsArray });
    const scriptResults = await myScript(page);
    await close();
    mock.restore();
    expect(scriptResults).to.be.an('array');
    expect(scriptResults).to.have.length(3);
    expect(scriptResults).to.deep.equal(expectedResults);
  });

  it('Should throw if throwIfNotMapped is set to true and a path was not found', async () => {
    const { page, close } = await launchSession();
    const mock = mockGoto(page, {
      paths: partialPathsArray,
      throwIfNotMapped: true,
    });
    await expect(myScript(page)).to.be.rejectedWith(Error);
    await close();
    mock.restore();
  });

  it('Should visit the original URL if throwIfNotMapped is not set (or false) and a path was not found', async () => {
    const { page, close } = await launchSession();
    const mock = mockGoto(page, { paths: partialPathsArray });
    await myScript(page).catch(() => {});
    await close();
    expect(mock.getCall(2).args[0]).to.equal('https://somewebsite.com/silverado.html');
    await expect(mock.getCall(2).returnValue).to.be.rejectedWith();
    mock.restore();
  });
}

async function launchPuppeteerSession(): Promise<BrowserSession> {
  const browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
    headless: true,
    timeout: 10000,
  });
  const page = await browser.newPage();
  return {
    page,
    close: () => browser.close(),
  };
}

async function launchPlaywrightSession(): Promise<BrowserSession> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage();
  return {
    page,
    close: () => browser.close(),
  };
}

describe('mock-goto with Puppeteer', () => {
  registerTests(launchPuppeteerSession);
});

describe('mock-goto with Playwright', () => {
  registerTests(launchPlaywrightSession);
});
