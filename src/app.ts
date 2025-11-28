import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';

import { appConfig } from './config/config';
import { securityConfig } from './config/security-config';
import {
  errorHandler,
  requestMetadata,
  securityHeaders,
  customSecurityHeaders,
  apiRateLimiter,
  mongoSanitization,
  httpParameterPollution,
  xssSanitization,
  requestTimeout,
  contentTypeValidator,
  parameterLimit,
  securityLogger,
  metricsMiddleware,
  metricsHandler,
} from './middleware';
import { AppRouter } from './routes';
import { LoggingStream, NotFoundError } from './utils';

export const app: express.Application = express();

// ============================================
// SECURITY MIDDLEWARE (Order is important!)
// ============================================

// 1. Security Headers - Must be first
app.use(securityHeaders);
app.use(customSecurityHeaders);

// 2. Request Size Limits
app.use(express.json({ limit: `${securityConfig.requestLimits.json} bytes` }));
app.use(
  express.urlencoded({
    extended: true,
    limit: `${securityConfig.requestLimits.urlencoded} bytes`,
    parameterLimit: securityConfig.requestLimits.parameterLimit,
  }),
);

// 3. Request Timeout
app.use(requestTimeout(securityConfig.requestLimits.timeout));

// 4. Content-Type Validation
app.use(contentTypeValidator);

// 5. Parameter Limits
app.use(parameterLimit);

// 6. Rate Limiting (before request processing)
app.use('/api', apiRateLimiter);

// 7. Input Sanitization
app.use(mongoSanitization); // MongoDB injection prevention
app.use(httpParameterPollution); // HTTP Parameter Pollution prevention
app.use(xssSanitization); // XSS prevention

// 8. Security Logging
app.use(securityLogger);

// ============================================
// APPLICATION MIDDLEWARE
// ============================================

// Request Metadata (for tracking)
app.use(requestMetadata);

// Metrics Middleware (after request metadata for route tracking)
app.use(metricsMiddleware);

// Request Logging
morganBody(app, {
  noColors: true,
  prettify: false,
  logRequestId: true,
  stream: new LoggingStream(),
  filterParameters: [
    'password',
    'access_token',
    'refresh_token',
    'id_token',
    'secret',
    'api_key',
    'apikey',
  ],
});

// CORS Configuration
app.use(
  cors({
    origin: securityConfig.cors.origin,
    credentials: securityConfig.cors.credentials,
    methods: securityConfig.cors.methods,
    allowedHeaders: securityConfig.cors.allowedHeaders,
    exposedHeaders: securityConfig.cors.exposedHeaders,
    maxAge: securityConfig.cors.maxAge,
  }),
);

// Metrics Endpoint (before API routes to avoid rate limiting)
app.get('/metrics', metricsHandler);

// API Routes
app.use('/api', AppRouter);

// 404 Handler
app.use((_req, _res, next) => next(new NotFoundError()));

// Error Handler (must be last)
app.use(errorHandler);

// Application Settings
app.set('port', appConfig.port);
app.set('trust proxy', 1); // Trust first proxy (for rate limiting behind proxy)
