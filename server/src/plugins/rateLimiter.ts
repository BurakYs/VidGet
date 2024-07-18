import fp from 'fastify-plugin';
import fastifyRateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';

const rateLimiter = fp(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    global: true,
    max: 25,
    timeWindow: 60000,
    hook: 'preParsing',
    allowList: ['127.0.0.1'],
    keyGenerator: (request) => request.clientIp,
    skipOnError: false,
    addHeadersOnExceeding: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': false,
      'x-ratelimit-reset': false,
      'retry-after': false
    },
    addHeaders: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': false,
      'x-ratelimit-reset': false
    }
  } as RateLimitPluginOptions);
});

export default rateLimiter;