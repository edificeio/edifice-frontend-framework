import pino from 'pino';

const PinoLevelToSeverityLookup = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

class LoggerService {
  private logger: pino.Logger;

  private defaultPinoConf = {
    messageKey: 'message',
  };

  constructor() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    });
  }

  debug(message: any, ...args: any) {
    this.logger.debug(message, ...args);
  }

  info(message: any, ...args: any) {
    this.logger.info(message, ...args);
  }

  warn(message: any, ...args: any) {
    this.logger.warn(message, ...args);
  }

  error(message: any, ...args: any) {
    this.logger.error(message, ...args);
  }
}

export const logger = new LoggerService();
