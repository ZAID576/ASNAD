const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'refreshToken', 'secret', 'client_secret', 'authorization'];

function redactSensitiveData(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redactSensitiveData);

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = redactSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export const logger = {
  info: (message, meta) => {
    const formattedMeta = meta ? JSON.stringify(redactSensitiveData(meta)) : '';
    console.log(`[${new Date().toISOString()}] [INFO]: ${message} ${formattedMeta}`);
  },
  warn: (message, meta) => {
    const formattedMeta = meta ? JSON.stringify(redactSensitiveData(meta)) : '';
    console.warn(`[${new Date().toISOString()}] [WARN]: ${message} ${formattedMeta}`);
  },
  error: (message, error) => {
    const errObj = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : redactSensitiveData(error);
    console.error(`[${new Date().toISOString()}] [ERROR]: ${message}`, errObj);
  },
  debug: (message, meta) => {
    if (process.env.NODE_ENV === 'development') {
      const formattedMeta = meta ? JSON.stringify(redactSensitiveData(meta)) : '';
      console.debug(`[${new Date().toISOString()}] [DEBUG]: ${message} ${formattedMeta}`);
    }
  }
};

