module.exports = {
  // Transform TypeScript files
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns - look for tests in test folders
  testMatch: [
    '**/test/**/*.test.ts',
    '**/test/**/*.spec.ts',
    '**/__tests__/**/*.ts',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Root directories
  roots: ['<rootDir>/src'],
  
  // Module name mapping (for path aliases if needed)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/test/**',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
  ],
  
  // Coverage thresholds (adjust as needed)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Test timeout (in milliseconds)
  testTimeout: 10000,
  
  // Force exit only in CI (where we need it)
  // In local development, let Jest detect open handles
  forceExit: process.env.CI === 'true',
};
