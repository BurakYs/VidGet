import fp from 'fastify-plugin';
import fastifyRateLimit, { RateLimitPluginOptions } from '@fastify/rate-limit';

const rateLimiter = fp(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    global: true,
    max: 50,
    ban: 2,
    timeWindow: 60000,
    hook: 'preHandler',
    allowList: ['127.0.0.1'],
    keyGenerator: (request) => request.clientIp,
    skipOnError: false,
    addHeadersOnExceeding: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': false,
      'x-ratelimit-reset': true,
      'retry-after': false,
    },
    addHeaders: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': false,
    },
  } as RateLimitPluginOptions);
});

export default rateLimiter;
