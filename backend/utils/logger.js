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

const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
};

if (process.env.NODE_ENV === 'development') {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

const logger = pino(pinoConfig, redactorOptions);

module.exports = logger;
