import express from 'express';
import { apiHealthCheckRouter } from './controller/api-health-check/api-health-check.router';
import { usersRouter } from './controller/users/users.router';

export const AppRouter = express.Router();

// Health check route
AppRouter.use('/api-health-check', apiHealthCheckRouter);

// Users routes - Example route with success and error codes
AppRouter.use('/users', usersRouter);
