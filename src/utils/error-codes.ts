/**
 * Error Code Prefixes
 * Format: PREFIX-XXX
 * Where PREFIX is a 3-letter code representing the error category
 * and XXX is a 3-digit number for specific errors
 */
export enum ErrorPrefix {
  // Application Errors (APP)
  APP = 'APP',
  // Validation Errors (VAL)
  VAL = 'VAL',
  // Authentication Errors (AUT)
  AUT = 'AUT',
  // Authorization Errors (AUT)
  AUTZ = 'AUTZ',
  // Database Errors (DB)
  DB = 'DB',
  // External Service Errors (EXT)
  EXT = 'EXT',
  // Not Found Errors (NF)
  NF = 'NF',
  // Business Logic Errors (BL)
  BL = 'BL',
  // System Errors (SYS)
  SYS = 'SYS',
}

/**
 * Error Codes Enum
 * Format: PREFIX-XXX
 */
export enum ErrorCode {
  // Application Errors (APP-XXX)
  APP_000 = 'APP-000', // Unknown application error
  APP_001 = 'APP-001', // Internal server error
  APP_002 = 'APP-002', // Service unavailable
  APP_003 = 'APP-003', // Request timeout

  // Validation Errors (VAL-XXX)
  VAL_000 = 'VAL-000', // General validation error
  VAL_001 = 'VAL-001', // Invalid input format
  VAL_002 = 'VAL-002', // Missing required field
  VAL_003 = 'VAL-003', // Invalid field value
  VAL_004 = 'VAL-004', // Invalid data type
  VAL_005 = 'VAL-005', // Field length exceeded

  // Authentication Errors (AUT-XXX)
  AUT_000 = 'AUT-000', // General authentication error
  AUT_001 = 'AUT-001', // Invalid credentials
  AUT_002 = 'AUT-002', // Token expired
  AUT_003 = 'AUT-003', // Token invalid
  AUT_004 = 'AUT-004', // Token missing
  AUT_005 = 'AUT-005', // Authentication required

  // Authorization Errors (AUTZ-XXX)
  AUTZ_000 = 'AUTZ-000', // General authorization error
  AUTZ_001 = 'AUTZ-001', // Insufficient permissions
  AUTZ_002 = 'AUTZ-002', // Access denied
  AUTZ_003 = 'AUTZ-003', // Resource forbidden

  // Database Errors (DB-XXX)
  DB_000 = 'DB-000', // General database error
  DB_001 = 'DB-001', // Connection failed
  DB_002 = 'DB-002', // Query failed
  DB_003 = 'DB-003', // Transaction failed
  DB_004 = 'DB-004', // Constraint violation
  DB_005 = 'DB-005', // Record not found

  // External Service Errors (EXT-XXX)
  EXT_000 = 'EXT-000', // General external service error
  EXT_001 = 'EXT-001', // Service unavailable
  EXT_002 = 'EXT-002', // Service timeout
  EXT_003 = 'EXT-003', // Invalid response format

  // Not Found Errors (NF-XXX)
  NF_000 = 'NF-000', // General not found error
  NF_001 = 'NF-001', // Resource not found
  NF_002 = 'NF-002', // Route not found
  NF_003 = 'NF-003', // Endpoint not found

  // Business Logic Errors (BL-XXX)
  BL_000 = 'BL-000', // General business logic error
  BL_001 = 'BL-001', // Invalid operation
  BL_002 = 'BL-002', // Business rule violation
  BL_003 = 'BL-003', // Duplicate entry
  BL_004 = 'BL-004', // State conflict

  // System Errors (SYS-XXX)
  SYS_000 = 'SYS-000', // General system error
  SYS_001 = 'SYS-001', // Configuration error
  SYS_002 = 'SYS-002', // Environment error
  SYS_003 = 'SYS-003', // Memory error
}

/**
 * Error Messages Map
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  // Application Errors
  [ErrorCode.APP_000]: 'An unknown application error occurred',
  [ErrorCode.APP_001]: 'Internal server error',
  [ErrorCode.APP_002]: 'Service is currently unavailable',
  [ErrorCode.APP_003]: 'Request timeout',

  // Validation Errors
  [ErrorCode.VAL_000]: 'Validation error occurred',
  [ErrorCode.VAL_001]: 'Invalid input format',
  [ErrorCode.VAL_002]: 'Missing required field',
  [ErrorCode.VAL_003]: 'Invalid field value',
  [ErrorCode.VAL_004]: 'Invalid data type',
  [ErrorCode.VAL_005]: 'Field length exceeded',

  // Authentication Errors
  [ErrorCode.AUT_000]: 'Authentication error occurred',
  [ErrorCode.AUT_001]: 'Invalid credentials',
  [ErrorCode.AUT_002]: 'Authentication token has expired',
  [ErrorCode.AUT_003]: 'Invalid authentication token',
  [ErrorCode.AUT_004]: 'Authentication token is missing',
  [ErrorCode.AUT_005]: 'Authentication required',

  // Authorization Errors
  [ErrorCode.AUTZ_000]: 'Authorization error occurred',
  [ErrorCode.AUTZ_001]: 'Insufficient permissions',
  [ErrorCode.AUTZ_002]: 'Access denied',
  [ErrorCode.AUTZ_003]: 'Resource is forbidden',

  // Database Errors
  [ErrorCode.DB_000]: 'Database error occurred',
  [ErrorCode.DB_001]: 'Database connection failed',
  [ErrorCode.DB_002]: 'Database query failed',
  [ErrorCode.DB_003]: 'Database transaction failed',
  [ErrorCode.DB_004]: 'Database constraint violation',
  [ErrorCode.DB_005]: 'Record not found in database',

  // External Service Errors
  [ErrorCode.EXT_000]: 'External service error occurred',
  [ErrorCode.EXT_001]: 'External service is unavailable',
  [ErrorCode.EXT_002]: 'External service timeout',
  [ErrorCode.EXT_003]: 'Invalid response from external service',

  // Not Found Errors
  [ErrorCode.NF_000]: 'Resource not found',
  [ErrorCode.NF_001]: 'The requested resource was not found',
  [ErrorCode.NF_002]: 'Route not found',
  [ErrorCode.NF_003]: 'Endpoint not found',

  // Business Logic Errors
  [ErrorCode.BL_000]: 'Business logic error occurred',
  [ErrorCode.BL_001]: 'Invalid operation',
  [ErrorCode.BL_002]: 'Business rule violation',
  [ErrorCode.BL_003]: 'Duplicate entry detected',
  [ErrorCode.BL_004]: 'State conflict occurred',

  // System Errors
  [ErrorCode.SYS_000]: 'System error occurred',
  [ErrorCode.SYS_001]: 'Configuration error',
  [ErrorCode.SYS_002]: 'Environment error',
  [ErrorCode.SYS_003]: 'Memory error',
};
