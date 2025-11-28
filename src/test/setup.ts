/**
 * Jest Test Setup
 * This file runs before each test file
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Increase timeout for async operations
jest.setTimeout(10000);

// Clean up timers and handles after each test
afterEach(async () => {
  // Clear all timers
  jest.clearAllTimers();

  // Wait for any pending promises to resolve
  await new Promise((resolve) => setImmediate(resolve));
});

// Global test utilities can be added here
global.console = {
  ...console,
  // Uncomment to silence console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
