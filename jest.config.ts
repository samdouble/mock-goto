export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // chai-as-promised v8+ and check-error are ESM-only
  transformIgnorePatterns: [
    'node_modules/(?!(chai-as-promised|check-error)/)',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    'node_modules/(chai-as-promised|check-error)/.+\\.js$': 'babel-jest',
  },
};
