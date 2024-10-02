import fp from 'fastify-plugin';
import fastifyRateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';

export default fp(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    global: true,
    max: 25,
    timeWindow: 60000,
    hook: 'onRequest',
    allowList: ['127.0.0.1'],
    keyGenerator: (request) => request.clientIp,
    skipOnError: false,
    addHeadersOnExceeding: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': false,
      'x-ratelimit-reset': false
    },
    addHeaders: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': false,
      'x-ratelimit-reset': false,
      'retry-after': false
    }
  } satisfies RateLimitPluginOptions);
});