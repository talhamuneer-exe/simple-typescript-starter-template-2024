import express from 'express';
import { apiHealthCheckRouter } from './controller/api-health-check/api-health-check.router';
import { usersRouter } from './controller/users/users.router';
// Example: Import auth rate limiter for authentication routes
// import { authRateLimiter } from './middleware';

export const AppRouter = express.Router();

// Health check route (no rate limiting needed)
AppRouter.use('/api-health-check', apiHealthCheckRouter);

// Users routes
// Example: Apply rate limiting to specific routes
// AppRouter.post('/users/login', authRateLimiter, usersRouter);
AppRouter.use('/users', usersRouter);

// Example: Apply authentication rate limiter to auth routes
// AppRouter.post('/auth/login', authRateLimiter, loginController);
// AppRouter.post('/auth/register', authRateLimiter, registerController);
// AppRouter.post('/auth/password-reset', passwordResetRateLimiter, resetController);
