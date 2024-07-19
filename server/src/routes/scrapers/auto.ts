import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';
import app from '@/config/app';

import type { ScrapePlatform } from '@/schemas/scrape';
import { scrapePlatform } from '@/schemas/scrape';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: scrapePlatform
    },
    handler: async (request: Request, response: Response) => {
      const { url } = request.body as ScrapePlatform;

      const scraper = app.supportedPlatforms.find(platform => platform.hosts.includes(new URL(url).hostname));
      if (!scraper) return response.sendError('We don\'t support this platform yet', 400);

      response.code(307).redirect(`/scrapers/${scraper.name.toLowerCase()}`);
    }
  });
};