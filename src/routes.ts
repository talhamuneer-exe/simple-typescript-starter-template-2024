import express from 'express';
import { apiHealthCheckRouter } from './controller/api-health-check/api-health-check.router';

export const AppRouter = express.Router();
AppRouter.use('/api-health-check', apiHealthCheckRouter);
