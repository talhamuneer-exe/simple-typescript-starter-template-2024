import cors from 'cors';
import express from 'express';
import morganBody from 'morgan-body';

import { appConfig } from './config/config';
import { errorHandler, requestId } from './middleware';
import { AppRouter } from './routes';
import { LoggingStream, NotFoundError } from './utils';

export const app: express.Application = express();
app.use(express.json());
app.use(requestId);
morganBody(app, {
  noColors: true,
  prettify: false,
  logRequestId: true,
  stream: new LoggingStream(),
  filterParameters: ['password', 'access_token', 'refresh_token', 'id_token'],
});
app.use(cors());
app.use('/api', AppRouter);
app.use((_req, _res, next) => next(new NotFoundError()));
app.use(errorHandler);
app.set('port', appConfig.port);
