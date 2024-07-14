import fp from 'fastify-plugin';
import fastifyStatic, { type FastifyStaticOptions } from '@fastify/static';
import path from 'path';
import app from '@/config/app';

const root = path.join(__dirname, '../../public');

const staticServer = fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root,
    prefix: '/assets',
    constraints: {
      host: app.rootUrl
    }
  } as FastifyStaticOptions);

  fastify.get('/favicon.ico', (_request, response) => {
    response.type('image/x-icon').sendFile('favicon.ico');
  });
});

export default staticServer;