/// <reference path="../../types/index.d.ts" />
import { SuccessResponse } from '../../utils';
import { Request, Response } from 'express';
import { API_HEALTH_CHECK_CODES } from '../../utils/route-codes';

/**
 * API Health Check Controller
 * Returns comprehensive health check response with all tracking fields
 */
export class apiHealthCheckController {
  public static apiHealthCheck(req: Request, res: Response): void {
    // Get request metadata for additional context
    const metadata = (req as Request & { metadata?: { method?: string; path?: string; ip?: string; userAgent?: string; correlationId?: string; traceId?: string } }).metadata;
    
    // Prepare health check data
    const healthData = {
      status: 'healthy',
      service: 'API Service',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(), // Server uptime in seconds
      timestamp: new Date().toISOString(),
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100, // MB
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100, // MB
        percentage: Math.round(
          (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
        ),
      },
      // Request context information
      request: {
        method: metadata?.method || req.method,
        path: metadata?.path || req.path,
        ip: metadata?.ip,
        userAgent: metadata?.userAgent,
        correlationId: metadata?.correlationId,
        traceId: metadata?.traceId,
      },
    };

    // Using route-specific success code
    const successCode = API_HEALTH_CHECK_CODES.success.VERIFY_SUCCESS;
    
    const success = new SuccessResponse(
      res,
      successCode.message,
      healthData,
      successCode.code, // Route-specific success code: API-001-SUC
    );
    
    success.send();
  }
}
