import { app } from './app';
// import sequelize from './config/sequelize';
import { logger } from './utils';

// sequelize
//   .authenticate()
//   .then(() => {
//     logger.info('POSTGRES_DB_CONNECTED', 'SUCCESS');
//   })
//   .catch((error: unknown) => {
//     logger.error('POSTGRES_DB_CONNECTION_FAILED', error);
//   });

const server = app.listen(app.get('port'), async () => {
  logger.info('ENVIRONMENT', process.env.NODE_ENV || 'No Environment Found.');
  logger.info(
    'APP_START',
    `App is running at http://localhost:${app.get('port')} in ${app.get(
      'env',
    )} mode`,
  );
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT_EXCEPTION', {
    message: error.message,
    name: error.name,
    stack: error.stack,
  });

  // Graceful shutdown
  server.close(() => {
    logger.info('SERVER_CLOSED', 'Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    logger.error('UNHANDLED_REJECTION', {
      reason: reason instanceof Error ? reason.message : String(reason),
      promise: promise.toString(),
      ...(reason instanceof Error && { stack: reason.stack }),
    });

    // Graceful shutdown
    server.close(() => {
      logger.info('SERVER_CLOSED', 'Server closed due to unhandled rejection');
      process.exit(1);
    });
  },
);

// Handle SIGTERM (e.g., from Docker)
process.on('SIGTERM', () => {
  logger.info(
    'SIGTERM_RECEIVED',
    'SIGTERM signal received: closing HTTP server',
  );
  server.close(() => {
    logger.info('SERVER_CLOSED', 'HTTP server closed');
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT_RECEIVED', 'SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('SERVER_CLOSED', 'HTTP server closed');
    process.exit(0);
  });
});

export default server;
