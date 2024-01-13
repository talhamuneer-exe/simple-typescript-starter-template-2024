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

process.on('uncaughtException', (error) => {
  logger.error('UNHANDLED_REJECTION', error.message);
});

export default server;
