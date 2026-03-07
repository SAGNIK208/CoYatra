import pino, { LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

if (!isProduction) {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(pinoOptions);

export default logger;
