import {
  AppError,
  InternalError,
  ValidationError,
  NotFoundError,
  BadRequestError,
} from '../app-error';
import { ErrorCode } from '../error-codes';

describe('App Error Classes', () => {
  describe('InternalError', () => {
    it('should create internal error with default message', () => {
      // Act
      const error = new InternalError();

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.APP_001);
      expect(error.message).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.isOperational).toBe(true);
    });

    it('should create internal error with custom message', () => {
      // Arrange
      const message = 'Custom error message';

      // Act
      const error = new InternalError(message);

      // Assert
      expect(error.message).toBe(message);
    });

    it('should create internal error with custom code', () => {
      // Act
      const error = new InternalError('Error', ErrorCode.APP_002);

      // Assert
      expect(error.code).toBe(ErrorCode.APP_002);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      // Act
      const error = new ValidationError('Invalid input');

      // Assert
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.VAL_000);
      expect(error.message).toBe('Invalid input');
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      // Act
      const error = new NotFoundError('Resource not found');

      // Assert
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.NF_001);
      expect(error.message).toBe('Resource not found');
    });
  });

  describe('BadRequestError', () => {
    it('should create bad request error', () => {
      // Act
      const error = new BadRequestError('Bad request');

      // Assert
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.VAL_000);
      expect(error.message).toBe('Bad request');
    });
  });

  describe('Error toJSON', () => {
    it('should serialize error to JSON', () => {
      // Arrange
      const error = new InternalError('Test error');

      // Act
      const json = error.toJSON();

      // Assert
      expect(json).toHaveProperty('name', 'InternalError');
      expect(json).toHaveProperty('code', ErrorCode.APP_001);
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('prefix', 'APP');
      expect(json).toHaveProperty('message', 'Test error');
      expect(json).toHaveProperty('statusCode');
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('isOperational', true);
    });

    it('should include stack trace in non-production', () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const error = new InternalError('Test error');

      // Act
      const json = error.toJSON();

      // Assert
      expect(json).toHaveProperty('stack');

      // Cleanup
      process.env.NODE_ENV = originalEnv;
    });
  });
});

