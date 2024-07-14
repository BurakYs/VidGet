import fp from 'fastify-plugin';
import fastifyStatic, { type FastifyStaticOptions } from '@fastify/static';
import path from 'path';

const root = path.join(__dirname, '../../public');

const staticServer = fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root,
    prefix: '/assets'
  } as FastifyStaticOptions);

  fastify.get('/favicon.ico', (_request, response) => {
    response.type('image/x-icon').sendFile('favicon.ico', root);
  });
});

export default staticServer;