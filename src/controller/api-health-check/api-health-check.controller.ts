import { SuccessResponse } from '../../utils';
import { Request, Response } from 'express';
import { API_HEALTH_CHECK_CODES } from '../../utils/route-codes';

/**
 * API Health Check Controller
 * Returns health check response with standardized tracking fields
 * Note: Request tracking fields (requestId, correlationId, traceId, method, endpoint, etc.)
 * are automatically added by SuccessResponse base class, so we only include health-specific data
 */
export class apiHealthCheckController {
  public static apiHealthCheck(_req: Request, res: Response): void {
    // Only specify customizable fields (status, service)
    // Server metadata (version, environment, uptime, server, memory) is automatically included
    const healthData = {
      status: 'healthy', // Customizable
      service: 'API Service', // Customizable
      // All other fields (version, environment, uptime, server, memory) are auto-added
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
