const logger = require('./logger');

class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlSeconds = 3600) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
    logger.debug({ key, ttl: ttlSeconds }, 'Cache set');
  }

  get(key) {
    const cached = this.store.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.store.delete(key);
      logger.debug({ key }, 'Cache expired');
      return null;
    }

    logger.debug({ key }, 'Cache hit');
    return cached.value;
  }

  delete(key) {
    this.store.delete(key);
    logger.debug({ key }, 'Cache deleted');
  }

  clear() {
    this.store.clear();
    logger.debug('Cache cleared');
  }

  has(key) {
    return this.get(key) !== null;
  }
}

module.exports = new Cache();
