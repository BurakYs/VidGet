import fp from 'fastify-plugin';
import fastifyCors, { type FastifyCorsOptions } from '@fastify/cors';
import app from '@/config/app';

const cors = fp(async (fastify) => {
  fastify.register(fastifyCors, {
    methods: ['GET', 'POST'],
    origin: app.rootUrl
  } as FastifyCorsOptions);
});

export default cors;