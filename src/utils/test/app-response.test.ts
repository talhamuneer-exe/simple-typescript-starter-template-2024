import { Response } from 'express';
import {
  SuccessResponse,
  BadRequestResponse,
  NotFoundResponse,
} from '../app-response';
import { ErrorCode } from '../error-codes';
import { createMockResponse } from '../../test/helpers';

describe('App Response Classes', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = createMockResponse();
    // Add required properties
    (mockResponse as any).id = 'test-request-id';
    (mockResponse as any).metadata = {
      requestId: 'test-request-id',
      correlationId: 'test-correlation-id',
      traceId: 'test-trace-id',
      requestTimestamp: new Date().toISOString(),
      path: '/api/test',
      method: 'GET',
    };
    (mockResponse as any).locals = { startTime: Date.now() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SuccessResponse', () => {
    it('should create success response with all required fields', () => {
      // Arrange
      const message = 'Operation successful';
      const data = { users: [] };

      // Act
      new SuccessResponse(mockResponse as Response, message, data).send();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toHaveProperty('requestId');
      expect(jsonCall).toHaveProperty('message', message);
      expect(jsonCall).toHaveProperty('data', data);
      expect(jsonCall).toHaveProperty('timestamp');
    });

    it('should include route-specific response code when provided', () => {
      // Arrange
      const responseCode = 'USR-001-SUC';

      // Act
      new SuccessResponse(
        mockResponse as Response,
        'Success',
        { data: 'test' },
        responseCode,
      ).send();

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toHaveProperty('responseCode', responseCode);
    });

    it('should include UTC timestamp', () => {
      // Act
      new SuccessResponse(mockResponse as Response, 'Success').send();

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(jsonCall.timestamp).toContain('Z');
    });
  });

  describe('BadRequestResponse', () => {
    it('should create error response with error code', () => {
      // Arrange
      const message = 'Validation failed';
      const errorCode = ErrorCode.VAL_001;

      // Act
      new BadRequestResponse(
        mockResponse as Response,
        message,
        errorCode,
      ).send();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toHaveProperty('errorCode', errorCode);
      expect(jsonCall).toHaveProperty('message', message);
      expect(jsonCall).toHaveProperty('timestamp');
    });

    it('should include route-specific response code when provided', () => {
      // Arrange
      const responseCode = 'USR-001-ERR';

      // Act
      new BadRequestResponse(
        mockResponse as Response,
        'Error',
        ErrorCode.VAL_001,
        responseCode,
      ).send();

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toHaveProperty('responseCode', responseCode);
      expect(jsonCall).toHaveProperty('errorCode', ErrorCode.VAL_001);
    });
  });

  describe('NotFoundResponse', () => {
    it('should create 404 response', () => {
      // Act
      new NotFoundResponse(mockResponse as Response).send();

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toHaveProperty('message', 'Not Found');
      expect(jsonCall).toHaveProperty('timestamp');
    });
  });
});

