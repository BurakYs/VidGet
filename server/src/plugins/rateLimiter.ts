import fp from 'fastify-plugin';
import fastifyRateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';

export default fp(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    global: true,
    max: 25,
    timeWindow: 60000,
    hook: 'preParsing',
    allowList: ['127.0.0.1'],
    keyGenerator: (request) => request.clientIp,
    skipOnError: false
  } satisfies RateLimitPluginOptions);
});