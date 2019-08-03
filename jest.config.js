module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/src/test-utils/setup.ts'],
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/coverage/',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  coverageReporters: ['json', 'lcov', 'text'],
}
