import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';
import scraperConfig from '@/config/scraper';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (_request: Request, response: Response) => {
      response.code(200).send('OK');
    }
  });

  fastify.route({
    method: 'GET',
    url: '/hosts',
    handler: async (_request: Request, response: Response) => {
      response.sendSuccess(scraperConfig.supportedPlatforms.map(x => x.name), 200);
    }
  });
};