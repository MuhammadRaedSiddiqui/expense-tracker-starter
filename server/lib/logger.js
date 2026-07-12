const isProduction = process.env.NODE_ENV === 'production';

function formatMessage(level, message, meta = {}) {
  if (isProduction) {
    return JSON.stringify({ level, msg: message, ...meta, timestamp: new Date().toISOString() });
  }
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  info(message, meta) {
    console.log(formatMessage('info', message, meta));
  },
  warn(message, meta) {
    console.warn(formatMessage('warn', message, meta));
  },
  error(message, meta) {
    const errorMeta = meta instanceof Error
      ? { error: meta.message, stack: meta.stack }
      : meta;
    console.error(formatMessage('error', message, errorMeta));
  },
  debug(message, meta) {
    if (!isProduction) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
