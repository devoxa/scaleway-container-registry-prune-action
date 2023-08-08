module.exports = {
  transform: { '^.+\\.tsx?$': '@swc/jest' },
  coverageProvider: 'v8',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  collectCoverageFrom: ['<rootDir>/src/**/*', '!<rootDir>/src/action.ts'],
  coverageThreshold: { global: { branches: 100, functions: 100, lines: 100, statements: 100 } },
}
