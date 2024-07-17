import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';

import type { ScrapeAuto } from '@/schemas/scrapers/auto';
import { scrapeAuto } from '@/schemas/scrapers/auto';
import app from '@/config/app';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: scrapeAuto
    },
    handler: async (request: Request, response: Response) => {
      const { url } = request.body as ScrapeAuto;

      const scraper = app.supportedPlatforms.find(platform => platform.hosts.includes(new URL(url).hostname));
      if (!scraper) {
        response.sendError('We don\'t support this platform yet', 400);
        return;
      }

      response.code(307).redirect(`/scrapers/${scraper.name.toLowerCase()}`);
    }
  });
};