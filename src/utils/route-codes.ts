/**
 * Route-Specific Code Definitions
 * Define codes for each route/endpoint here
 *
 * Format: ROUTE-XXX-TYPE
 * - ROUTE: Route identifier (e.g., USR for users, AUTH for auth)
 * - XXX: Sequential number
 * - TYPE: SUC (success) or ERR (error)
 */

import { createRouteCodes, responseCodeRegistry } from './response-codes';

/**
 * API Health Check Route Codes
 */
export const API_HEALTH_CHECK_CODES = createRouteCodes('api-health-check', {
  success: {
    VERIFY_SUCCESS: {
      code: 'API-001-SUC',
      message: 'API health check successful',
    },
  },
  error: {
    VERIFY_FAILED: {
      code: 'API-001-ERR',
      message: 'API health check failed',
    },
  },
});

/**
 * Get Users Route Codes
 * Example route codes for get-users endpoint
 */
export const GET_USERS_CODES = createRouteCodes('get-users', {
  success: {
    USERS_RETRIEVED: {
      code: 'USR-001-SUC',
      message: 'Users retrieved successfully',
    },
    USERS_EMPTY: {
      code: 'USR-002-SUC',
      message: 'No users found',
    },
  },
  error: {
    USERS_FETCH_FAILED: {
      code: 'USR-001-ERR',
      message: 'Failed to fetch users',
    },
    USERS_DB_ERROR: {
      code: 'USR-002-ERR',
      message: 'Database error while fetching users',
    },
    USERS_UNAUTHORIZED: {
      code: 'USR-003-ERR',
      message: 'Unauthorized to access users',
    },
  },
});

/**
 * Create User Route Codes
 * Example route codes for create-user endpoint
 */
export const CREATE_USER_CODES = createRouteCodes('create-user', {
  success: {
    USER_CREATED: {
      code: 'USR-010-SUC',
      message: 'User created successfully',
    },
  },
  error: {
    USER_CREATION_FAILED: {
      code: 'USR-010-ERR',
      message: 'Failed to create user',
    },
    USER_ALREADY_EXISTS: {
      code: 'USR-011-ERR',
      message: 'User already exists',
    },
    USER_VALIDATION_FAILED: {
      code: 'USR-012-ERR',
      message: 'User validation failed',
    },
  },
});

/**
 * Update User Route Codes
 */
export const UPDATE_USER_CODES = createRouteCodes('update-user', {
  success: {
    USER_UPDATED: {
      code: 'USR-020-SUC',
      message: 'User updated successfully',
    },
  },
  error: {
    USER_UPDATE_FAILED: {
      code: 'USR-020-ERR',
      message: 'Failed to update user',
    },
    USER_NOT_FOUND: {
      code: 'USR-021-ERR',
      message: 'User not found',
    },
  },
});

/**
 * Delete User Route Codes
 */
export const DELETE_USER_CODES = createRouteCodes('delete-user', {
  success: {
    USER_DELETED: {
      code: 'USR-030-SUC',
      message: 'User deleted successfully',
    },
  },
  error: {
    USER_DELETE_FAILED: {
      code: 'USR-030-ERR',
      message: 'Failed to delete user',
    },
    USER_NOT_FOUND: {
      code: 'USR-031-ERR',
      message: 'User not found',
    },
  },
});

/**
 * Helper function to get route codes
 * Usage: const codes = getRouteCodes('get-users');
 */
export function getRouteCodes(routeName: string) {
  return {
    success: (codeKey: string) => {
      const codes = responseCodeRegistry.getSuccessCode(routeName, codeKey);
      return codes;
    },
    error: (codeKey: string) => {
      const codes = responseCodeRegistry.getErrorCode(routeName, codeKey);
      return codes;
    },
  };
}
