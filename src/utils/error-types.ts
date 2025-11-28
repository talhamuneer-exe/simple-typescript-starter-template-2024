/**
 * Error Type Categories
 * Used to categorize errors for better handling
 */
export enum ErrorType {
  INTERNAL = 'InternalError',
  VALIDATION = 'ValidationError',
  AUTHENTICATION = 'AuthenticationError',
  AUTHORIZATION = 'AuthorizationError',
  DATABASE = 'DatabaseError',
  EXTERNAL = 'ExternalServiceError',
  NOT_FOUND = 'NotFoundError',
  BUSINESS_LOGIC = 'BusinessLogicError',
  SYSTEM = 'SystemError',
  BAD_REQUEST = 'BadRequest',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  CONFLICT = 'Conflict',
}

/**
 * Maps Error Types to HTTP Status Codes
 */
export const ErrorTypeToHttpStatus: Record<ErrorType, number> = {
  [ErrorType.INTERNAL]: 500,
  [ErrorType.VALIDATION]: 400,
  [ErrorType.AUTHENTICATION]: 401,
  [ErrorType.AUTHORIZATION]: 403,
  [ErrorType.DATABASE]: 500,
  [ErrorType.EXTERNAL]: 502,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.BUSINESS_LOGIC]: 400,
  [ErrorType.SYSTEM]: 500,
  [ErrorType.BAD_REQUEST]: 400,
  [ErrorType.UNAUTHORIZED]: 401,
  [ErrorType.FORBIDDEN]: 403,
  [ErrorType.CONFLICT]: 409,
};

