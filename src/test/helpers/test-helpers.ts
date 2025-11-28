import { Request, Response } from 'express';
import { RequestMetadata } from '../../types';

/**
 * Test Helpers
 * Utility functions for writing tests
 */

/**
 * Create a mock Express Request object
 */
export function createMockRequest(
  overrides: Partial<Request> = {},
): Partial<Request> {
  return {
    method: 'GET',
    path: '/api/test',
    originalUrl: '/api/test',
    query: {},
    params: {},
    body: {},
    headers: {},
    ...overrides,
  } as Partial<Request>;
}

/**
 * Create a mock Express Response object
 */
export function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    locals: { startTime: Date.now() },
  };

  // Add required properties for response tracking
  (res as any).id = 'test-request-id';
  (res as any).metadata = {
    requestId: 'test-request-id',
    correlationId: 'test-correlation-id',
    traceId: 'test-trace-id',
    requestTimestamp: new Date().toISOString(),
    path: '/api/test',
    method: 'GET',
    ip: '127.0.0.1',
    userAgent: 'test-agent',
  };

  // Mock response methods
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
}

/**
 * Create mock request metadata
 */
export function createMockMetadata(
  overrides: Partial<RequestMetadata> = {},
): RequestMetadata {
  return {
    requestId: 'test-request-id',
    correlationId: 'test-correlation-id',
    traceId: 'test-trace-id',
    requestTimestamp: new Date().toISOString(),
    method: 'GET',
    path: '/api/test',
    originalUrl: '/api/test',
    ip: '127.0.0.1',
    userAgent: 'test-agent',
    ...overrides,
  };
}

/**
 * Wait for a specified amount of time (useful for async tests)
 *
 * For better test performance and to avoid open handles, consider using:
 * - jest.useFakeTimers() and jest.advanceTimersByTime() for timer-based tests
 * - Promise.resolve() for immediate async operations
 *
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock error
 */
export function createMockError(message: string, name = 'Error'): Error {
  const error = new Error(message);
  error.name = name;
  return error;
}
