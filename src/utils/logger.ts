import stream from 'stream';
import winston from 'winston';

import { environment } from '../config/config';

const level = environment === 'production' ? 'info' : 'debug';

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
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
  info(code: string, message: any) {
    logMessage('info', code, message);
  }
  debug(code: string, message: any) {
    logMessage('debug', code, message);
  }
  error(code: string, message: any) {
    logMessage('error', code, message);
  }
}

export const logger = new Logger();
export class LoggingStream extends stream.Writable {
  write(chunk: any) {
    winstonLogger.info(chunk);
    return true;
  }
}
