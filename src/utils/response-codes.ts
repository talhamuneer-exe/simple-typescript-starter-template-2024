/**
 * Response Code System
 * Allows route-specific success and error codes
 * Format: ROUTE-XXX-TYPE
 * Where ROUTE is the route identifier, XXX is a number, TYPE is SUC/ERR
 */

/**
 * Base Response Code Interface
 */
export interface ResponseCode {
  code: string;
  message: string;
}

/**
 * Route-specific Response Codes
 * Define codes for each route/endpoint
 */
export interface RouteCodes {
  success: Record<string, ResponseCode>;
  error: Record<string, ResponseCode>;
}

/**
 * Response Code Registry
 * Central registry for all route-specific codes
 */
class ResponseCodeRegistry {
  private routes: Map<string, RouteCodes> = new Map();

  /**
   * Register codes for a route
   */
  register(routeName: string, codes: RouteCodes): void {
    this.routes.set(routeName, codes);
  }

  /**
   * Get success code for a route
   */
  getSuccessCode(routeName: string, codeKey: string): ResponseCode | undefined {
    const route = this.routes.get(routeName);
    return route?.success[codeKey];
  }

  /**
   * Get error code for a route
   */
  getErrorCode(routeName: string, codeKey: string): ResponseCode | undefined {
    const route = this.routes.get(routeName);
    return route?.error[codeKey];
  }

  /**
   * Get all codes for a route
   */
  getRouteCodes(routeName: string): RouteCodes | undefined {
    return this.routes.get(routeName);
  }

  /**
   * Check if route has codes registered
   */
  hasRoute(routeName: string): boolean {
    return this.routes.has(routeName);
  }
}

export const responseCodeRegistry = new ResponseCodeRegistry();

/**
 * Helper function to create route codes
 */
export function createRouteCodes(
  routeName: string,
  codes: RouteCodes,
): RouteCodes {
  responseCodeRegistry.register(routeName, codes);
  return codes;
}

/**
 * Common Response Code Patterns
 * Use these as templates or directly
 */
export const CommonResponseCodes = {
  // Generic Success Codes
  SUCCESS: {
    code: 'SUC-000',
    message: 'Operation completed successfully',
  },
  CREATED: {
    code: 'SUC-001',
    message: 'Resource created successfully',
  },
  UPDATED: {
    code: 'SUC-002',
    message: 'Resource updated successfully',
  },
  DELETED: {
    code: 'SUC-003',
    message: 'Resource deleted successfully',
  },
  RETRIEVED: {
    code: 'SUC-004',
    message: 'Resource retrieved successfully',
  },

  // Generic Error Codes (for route-specific errors)
  NOT_FOUND: {
    code: 'ERR-000',
    message: 'Resource not found',
  },
  VALIDATION_FAILED: {
    code: 'ERR-001',
    message: 'Validation failed',
  },
  OPERATION_FAILED: {
    code: 'ERR-002',
    message: 'Operation failed',
  },
};

