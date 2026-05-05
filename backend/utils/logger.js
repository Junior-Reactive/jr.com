const pino = require('pino');

const secretKeys = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'secret',
  'key',
  'apiKey',
  'api_key',
  'subscriptionKey',
  'clientSecret',
  'client_secret',
  'authorization',
  'jwtSecret',
  'dbPassword',
  'groqApiKey',
];

const redactorOptions = {
  redact: {
    paths: secretKeys.map(key => `**.${key}`),
    censor: '[REDACTED]',
  },
};

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: process.env.NODE_ENV === 'development',
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
  redactorOptions,
);

module.exports = logger;
