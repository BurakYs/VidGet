import fp from 'fastify-plugin';
import fastifyCors, { type FastifyCorsOptions } from '@fastify/cors';

const cors = fp(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: '*'
  } as FastifyCorsOptions);
});

export default cors;