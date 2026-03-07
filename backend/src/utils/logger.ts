import pino, { LoggerOptions, TransportTargetOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const betterStackToken = process.env.BETTERSTACK_SOURCE_TOKEN;

const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

const transports: TransportTargetOptions[] = [];

// 1. Better Stack (Production Remote Logging)
if (betterStackToken) {
  transports.push({
    target: '@logtail/pino',
    options: { sourceToken: betterStackToken },
    level: process.env.LOG_LEVEL || 'info',
  });
}

// 2. Pino Pretty (Local Development ONLY)
if (!isProduction) {
  transports.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
    level: process.env.LOG_LEVEL || 'info',
  });
}

// If we have transports, use them. Otherwise, pino defaults to stdout.
if (transports.length > 0) {
  pinoOptions.transport = {
    targets: transports,
  };
}

export const logger = pino(pinoOptions);

export default logger;
