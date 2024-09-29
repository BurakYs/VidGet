import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import scraperConfig from '@/config/scraper';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (_request: FastifyRequest, response: FastifyReply) => {
      response.code(200).send('OK');
    }
  });

  fastify.route({
    method: 'GET',
    url: '/hosts',
    handler: async (_request: FastifyRequest, response: FastifyReply) => {
      response.header('Cache-Control', 'public, max-age=86400');
      response.sendSuccess(scraperConfig.supportedPlatforms.map(x => x.name), 200);
    }
  });
};