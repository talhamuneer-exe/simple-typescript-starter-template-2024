import { Request, Response } from 'express';
import {
  SuccessResponse,
  BadRequestResponse,
  NotFoundError,
  DatabaseError,
  ErrorCode,
} from '../../utils';
import { GET_USERS_CODES } from '../../utils/route-codes';

/**
 * Example Users Controller
 * Demonstrates route-specific success and error codes
 */
export class UsersController {
  /**
   * Get Users - Example route with success and error codes
   * Route: GET /api/users
   */
  public static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      // Simulate fetching users (replace with actual database call)
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];

      // Check if users exist
      if (users.length === 0) {
        // Use route-specific success code for empty result
        const emptyCode = GET_USERS_CODES.success.USERS_EMPTY;
        const response = new SuccessResponse(
          res,
          emptyCode.message,
          { users: [], count: 0 },
          emptyCode.code, // Route-specific success code: USR-002-SUC
        );
        response.send();
        return;
      }

      // Use route-specific success code
      const successCode = GET_USERS_CODES.success.USERS_RETRIEVED;
      const response = new SuccessResponse(
        res,
        successCode.message,
        { users, count: users.length },
        successCode.code, // Route-specific success code: USR-001-SUC
      );
      response.send();
    } catch (error) {
      // Handle different error scenarios with route-specific error codes
      if (error instanceof DatabaseError) {
        const errorCode = GET_USERS_CODES.error.USERS_DB_ERROR;
        const response = new BadRequestResponse(
          res,
          errorCode.message,
          ErrorCode.DB_002, // System error code
          errorCode.code, // Route-specific error code: USR-002-ERR
        );
        response.send();
        return;
      }

      // Generic fetch failed error
      const errorCode = GET_USERS_CODES.error.USERS_FETCH_FAILED;
      const response = new BadRequestResponse(
        res,
        errorCode.message,
        ErrorCode.APP_001, // System error code
        errorCode.code, // Route-specific error code: USR-001-ERR
      );
      response.send();
    }
  }

  /**
   * Get User By ID - Example with error codes
   * Route: GET /api/users/:id
   */
  public static async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new NotFoundError('User ID is required', ErrorCode.NF_001);
    }

    // Simulate fetching user (replace with actual database call)
    const user = {
      id: parseInt(id),
      name: 'John Doe',
      email: 'john@example.com',
    };

    if (!user) {
      // Use route-specific error code
      const errorCode = GET_USERS_CODES.error.USERS_FETCH_FAILED;
      throw new NotFoundError(
        errorCode.message,
        ErrorCode.NF_001, // System error code
      );
    }

    const successCode = GET_USERS_CODES.success.USERS_RETRIEVED;
    const response = new SuccessResponse(
      res,
      successCode.message,
      { user },
      successCode.code, // Route-specific success code
    );
    response.send();
  }
}
