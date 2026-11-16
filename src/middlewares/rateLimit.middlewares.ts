import rateLimit = require('express-rate-limit');

// @ts-expect-error TS(2349): This expression is not callable.
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

// @ts-expect-error TS(2349): This expression is not callable.
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,             
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts' },
});

export { apiLimiter, authLimiter };