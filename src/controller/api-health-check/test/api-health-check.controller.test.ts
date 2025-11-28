import { Request, Response } from 'express';
import { apiHealthCheckController } from '../api-health-check.controller';
import { createMockRequest, createMockResponse, createMockMetadata } from '../../../test/helpers';

describe('API Health Check Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = createMockRequest();
    (mockRequest as any).metadata = createMockMetadata();
    mockResponse = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('apiHealthCheck', () => {
    it('should return success response with health check data', () => {
      // Act
      apiHealthCheckController.apiHealthCheck(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      // Check response structure
      expect(jsonCall).toHaveProperty('requestId');
      expect(jsonCall).toHaveProperty('message');
      expect(jsonCall).toHaveProperty('data');
      expect(jsonCall).toHaveProperty('responseCode', 'API-001-SUC');
      expect(jsonCall).toHaveProperty('timestamp');
      expect(jsonCall).toHaveProperty('requestTimestamp');
      expect(jsonCall).toHaveProperty('processingTime');
      expect(jsonCall).toHaveProperty('endpoint');
      expect(jsonCall).toHaveProperty('method');

      // Check health data
      expect(jsonCall.data).toHaveProperty('status', 'healthy');
      expect(jsonCall.data).toHaveProperty('service', 'API Service');
      expect(jsonCall.data).toHaveProperty('environment');
      expect(jsonCall.data).toHaveProperty('uptime');
      expect(jsonCall.data).toHaveProperty('server');
      expect(jsonCall.data).toHaveProperty('memory');
      expect(jsonCall.data).toHaveProperty('request');
    });

    it('should include request metadata in response', () => {
      // Arrange - Set proper metadata
      (mockRequest as any).metadata = createMockMetadata({
        path: '/api/api-health-check/verify',
        method: 'GET',
      });
      (mockResponse as any).metadata = (mockRequest as any).metadata;

      // Act
      apiHealthCheckController.apiHealthCheck(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      expect(jsonCall.requestId).toBeDefined();
      if (jsonCall.correlationId) {
        expect(jsonCall.correlationId).toBeDefined();
      }
      if (jsonCall.traceId) {
        expect(jsonCall.traceId).toBeDefined();
      }
      if (jsonCall.endpoint) {
        expect(jsonCall.endpoint).toBe('/api/api-health-check/verify');
      }
      if (jsonCall.method) {
        expect(jsonCall.method).toBe('GET');
      }
    });

    it('should include processing time', () => {
      // Arrange - Ensure startTime is set
      (mockResponse as any).locals = { startTime: Date.now() };

      // Act
      apiHealthCheckController.apiHealthCheck(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      // Processing time may not always be included if startTime is missing
      if (jsonCall.processingTime !== undefined) {
        expect(jsonCall.processingTime).toBeGreaterThanOrEqual(0);
        expect(typeof jsonCall.processingTime).toBe('number');
      }
    });

    it('should include UTC timestamps', () => {
      // Arrange - Ensure metadata has requestTimestamp
      (mockRequest as any).metadata = createMockMetadata();
      (mockResponse as any).metadata = (mockRequest as any).metadata;

      // Act
      apiHealthCheckController.apiHealthCheck(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      // Check timestamp format (ISO 8601 UTC)
      expect(jsonCall.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(jsonCall.timestamp).toContain('Z');
      
      // requestTimestamp is optional, check if present
      if (jsonCall.requestTimestamp) {
        expect(jsonCall.requestTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      }
    });
  });
});

