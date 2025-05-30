import puppeteer from 'puppeteer';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mockPuppeteerGoto from '.';
import myPuppeteerScript from '../tests/myPuppeteerScript';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('mock-puppeteer-goto', () => {
  it('Should work properly with a key-value config object', async () => {
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      headless: true,
      timeout: 10000,
    });
    const page = await browser.newPage();
    const mock = mockPuppeteerGoto(page, {
      paths: {
        'https://somewebsite.com/': './tests/main.html',
        'https://somewebsite.com/f150.html': './tests/f150.html',
        'https://somewebsite.com/silverado.html': './tests/silverado.html',
        'https://somewebsite.com/ram.html': './tests/ram.html',
      },
    });
    const scriptResults = await myPuppeteerScript(page);
    await browser.close();
    mock.restore();
    expect(scriptResults).to.be.an('array');
    expect(scriptResults).to.have.length(3);
    expect(scriptResults).to.deep.equal([
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
    ]);
  });

  it('Should work properly with an array config object', async () => {
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      headless: true,
      timeout: 10000,
    });
    const page = await browser.newPage();
    const mock = mockPuppeteerGoto(page, {
      paths: [
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
      ],
    });
    const scriptResults = await myPuppeteerScript(page);
    await browser.close();
    mock.restore();
    expect(scriptResults).to.be.an('array');
    expect(scriptResults).to.have.length(3);
    expect(scriptResults).to.deep.equal([
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
    ]);
  });

  it('Should throw if throwIfNotMapped is set to true and a path was not found', async () => {
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      headless: true,
      timeout: 10000,
    });
    const page = await browser.newPage();
    const mock = mockPuppeteerGoto(page, {
      paths: [
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
      ],
      throwIfNotMapped: true,
    });
    await expect(myPuppeteerScript(page)).to.be.rejectedWith(Error);
    await browser.close();
    mock.restore();
  });

  it('Should visit the original URL if throwIfNotMapped is not set (or false) and a path was not found', async () => {
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      headless: true,
      timeout: 10000,
    });
    const page = await browser.newPage();
    const mock = mockPuppeteerGoto(page, {
      paths: [
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
      ],
    });
    await myPuppeteerScript(page).catch(() => {});
    await browser.close();
    expect(mock.getCall(2).args[0]).to.equal('https://somewebsite.com/silverado.html');
    await expect(mock.getCall(2).returnValue).to.be.rejectedWith(); // net::ERR_NAME_NOT_RESOLVED
    mock.restore();
  });
});
