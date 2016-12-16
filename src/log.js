import winston from 'winston';

const log = (process.env.NODE_ENV !== 'test') ?
  new winston.Logger({
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        json: true,
      }),
    ],
    exitOnError: false,
  }) : {
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {},
  };

export default log;
