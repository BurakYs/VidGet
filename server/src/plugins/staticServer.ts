import fp from 'fastify-plugin';
import fastifyStatic, { type FastifyStaticOptions } from '@fastify/static';
import path from 'path';

const root = path.join(__dirname, '../../public');

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root,
    prefix: '/assets',
    cacheControl: true,
    maxAge: '1d'
  } satisfies FastifyStaticOptions);
});