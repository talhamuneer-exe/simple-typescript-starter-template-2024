/**
 * Helper utilities for using route-specific codes
 */

import { ResponseCode, responseCodeRegistry } from './response-codes';
import { ErrorCode } from './error-codes';
import {
  SuccessResponse,
  BadRequestResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ConflictResponse,
  InternalErrorResponse,
} from './app-response';
import { Response } from 'express';

/**
 * Create a success response with route-specific code
 */
export function createSuccessResponse(
  res: Response,
  routeName: string,
  codeKey: string,
  data?: unknown,
  customMessage?: string,
): SuccessResponse {
  const routeCode = responseCodeRegistry.getSuccessCode(routeName, codeKey);

  if (!routeCode) {
    // Fallback to generic success if route code not found
    return new SuccessResponse(
      res,
      customMessage || 'Operation completed successfully',
      data,
    );
  }

  return new SuccessResponse(
    res,
    customMessage || routeCode.message,
    data,
    routeCode.code,
  );
}

/**
 * Create an error response with route-specific code
 */
export function createErrorResponse(
  res: Response,
  routeName: string,
  codeKey: string,
  systemErrorCode: ErrorCode,
  customMessage?: string,
):
  | BadRequestResponse
  | NotFoundResponse
  | UnauthorizedResponse
  | ForbiddenResponse
  | ConflictResponse
  | InternalErrorResponse {
  const routeCode = responseCodeRegistry.getErrorCode(routeName, codeKey);

  if (!routeCode) {
    // Fallback to generic error if route code not found
    return new BadRequestResponse(
      res,
      customMessage || 'An error occurred',
      systemErrorCode,
    );
  }

  // Determine response type based on system error code prefix
  const prefix = systemErrorCode.split('-')[0];

  switch (prefix) {
    case 'NF':
      return new NotFoundResponse(
        res,
        customMessage || routeCode.message,
        systemErrorCode,
        routeCode.code,
      );
    case 'AUT':
      return new UnauthorizedResponse(
        res,
        customMessage || routeCode.message,
        systemErrorCode,
        routeCode.code,
      );
    case 'AUTZ':
      return new ForbiddenResponse(
        res,
        customMessage || routeCode.message,
        systemErrorCode,
        routeCode.code,
      );
    case 'BL':
      return new ConflictResponse(
        res,
        customMessage || routeCode.message,
        systemErrorCode,
        routeCode.code,
      );
    default:
      return new BadRequestResponse(
        res,
        customMessage || routeCode.message,
        systemErrorCode,
        routeCode.code,
      );
  }
}

/**
 * Get route code by key (for manual usage)
 */
export function getRouteSuccessCode(
  routeName: string,
  codeKey: string,
): ResponseCode | undefined {
  return responseCodeRegistry.getSuccessCode(routeName, codeKey);
}

/**
 * Get route error code by key (for manual usage)
 */
export function getRouteErrorCode(
  routeName: string,
  codeKey: string,
): ResponseCode | undefined {
  return responseCodeRegistry.getErrorCode(routeName, codeKey);
}
