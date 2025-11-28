import { ErrorCode, ErrorMessages } from './error-codes';

export const constants = {
  errorMessage: {
    unexpectedError: ErrorMessages[ErrorCode.APP_000],
  },
  // HTTP Status Messages
  httpStatus: {
    OK: 'OK',
    CREATED: 'Created',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
  },
  // Common Messages
  messages: {
    success: 'Operation completed successfully',
    created: 'Resource created successfully',
    updated: 'Resource updated successfully',
    deleted: 'Resource deleted successfully',
  },
};
