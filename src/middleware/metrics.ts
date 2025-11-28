import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Create a Registry to register metrics
export const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'nodejs_',
});

// HTTP Request Duration Histogram
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

// HTTP Request Counter
export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Active Requests Gauge
export const httpActiveRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Number of active HTTP requests',
  registers: [register],
});

// Error Counter
export const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'error_code'],
  registers: [register],
});

// Security Events Counter
export const securityEventsTotal = new client.Counter({
  name: 'security_events_total',
  help: 'Total number of security events',
  labelNames: ['event_type', 'endpoint'],
  registers: [register],
});

// Response Time Histogram
export const responseTimeHistogram = new client.Histogram({
  name: 'response_time_seconds',
  help: 'Response time in seconds',
  labelNames: ['endpoint', 'method'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Database Query Duration (if using database)
export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Rate Limit Hits Counter
export const rateLimitHits = new client.Counter({
  name: 'rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['endpoint', 'ip'],
  registers: [register],
});

/**
 * Metrics Middleware
 * Collects metrics for all HTTP requests
 */
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();
  const route = req.route?.path || req.path || 'unknown';

  // Increment active requests
  httpActiveRequests.inc();

  // Track response
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const statusCode = res.statusCode.toString();

    // Record request duration
    httpRequestDuration.labels(req.method, route, statusCode).observe(duration);

    // Increment request counter
    httpRequestTotal.labels(req.method, route, statusCode).inc();

    // Record response time
    responseTimeHistogram.labels(route, req.method).observe(duration);

    // Decrement active requests
    httpActiveRequests.dec();

    // Track errors
    if (statusCode >= '400') {
      const errorCode = (res.locals.errorCode as string) || 'UNKNOWN';
      httpErrorsTotal.labels(req.method, route, errorCode).inc();
    }
  });

  res.on('close', () => {
    // Decrement active requests if connection closed
    httpActiveRequests.dec();
  });

  next();
};

/**
 * Metrics Endpoint
 * Exposes Prometheus metrics at /metrics
 */
export const metricsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).json({
      message: 'Error generating metrics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
