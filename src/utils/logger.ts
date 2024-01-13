import stream from 'stream';

import appInsights = require('applicationinsights');
import winston from 'winston';

import { appConfig, environment } from '../config/config';

import { AiTransport } from './ai-transport';

appInsights
  .setup(appConfig.appInsightsKey)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .start();

const aIclient = appInsights.defaultClient;
aIclient.context.tags[aIclient.context.keys.cloudRole] = appConfig.serviceName;

const level = environment === 'production' ? 'info' : 'debug';

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level,
    }),
    new AiTransport({
      client: aIclient,
      level,
    }),
  ],
};

export const winstonLogger = winston.createLogger(options);
type LogLevels = 'info' | 'debug' | 'error';

const logMessage = (level: LogLevels, code: string, message: unknown) => {
  if (typeof message === 'object') {
    try {
      message =
        message instanceof Error
          ? JSON.stringify(message, Object.getOwnPropertyNames(message))
          : JSON.stringify(message);
    } catch (e) {
      message = `logger could not stringify ${message}`;
    }
  }
  winstonLogger[level]({ code, message });
};

class Logger {
  getAiClient() {
    return aIclient;
  }
  info(code: string, message: any) {
    logMessage('info', code, message);
  }
  debug(code: string, message: any) {
    logMessage('debug', code, message);
  }
  error(code: string, message: any) {
    logMessage('error', code, message);
  }
  trackEvent(name: string, data: any) {
    aIclient.trackEvent({
      name,
      time: new Date(),
      properties: data!,
    });
  }
}

export const logger = new Logger();
export class LoggingStream extends stream.Writable {
  write(chunk: any) {
    winstonLogger.info(chunk);
    return true;
  }
}
