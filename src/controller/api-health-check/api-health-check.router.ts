import express from 'express';
import { apiHealthCheckController } from './api-health-check.controller';

export const apiHealthCheckRouter = express.Router();

apiHealthCheckRouter.get('/verify', apiHealthCheckController.apiHealthCheck);
