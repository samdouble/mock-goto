import { expect } from 'chai';
import mockGoto from 'mock-goto';
import puppeteer from 'puppeteer';
import myScript from './index';

describe('My script', () => {
  it('Should return an array of trucks and for each, a list of engines', async () => {
    // Create a Puppeteer Page and use mock-goto to remap the pages your script will visit
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
      headless: true,
      timeout: 10000,
    });
    const page = await browser.newPage();
    const mock = mockGoto(page, {
      paths: {
        'https://somewebsite.com/': './html/main.html',
        'https://somewebsite.com/f150.html': './html/f150.html',
        'https://somewebsite.com/silverado.html': './html/silverado.html',
        'https://somewebsite.com/ram.html': './html/ram.html',
      },
    });

    // Call the script that you want to test.
    const results = await myScript(page);

    // Close the browser and restore the `goto` function
    await browser.close();
    mock.restore();

    expect(results).to.deep.equal([
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
});
