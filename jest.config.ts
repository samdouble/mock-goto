const esmPackages = [
  'chai',
  'chai-as-promised',
  'check-error',
  'puppeteer',
  'puppeteer-core',
  '@puppeteer',
  'chromium-bidi',
  'zod',
  'modern-tar',
].join('|');

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Several test deps are ESM-only and need babel-jest under CJS Jest
  transformIgnorePatterns: [
    `node_modules/(?!(${esmPackages})/)`,
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    [`node_modules/(${esmPackages})/.+\\.js$`]: 'babel-jest',
  },
};
