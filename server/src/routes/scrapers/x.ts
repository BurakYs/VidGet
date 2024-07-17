import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import XScraper from '@/utils/scrapers/x';
import calculateTTLSeconds from '@/utils/calculateTTLSeconds';
import app from '@/config/app';

import type { ScrapePost } from '@/schemas/scrapers/x';
import { scrapePost } from '@/schemas/scrapers/x';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: scrapePost
    },
    handler: async (request: Request, response: Response) => {
      const { url } = request.body as ScrapePost;

      const xHosts = app.supportedPlatforms.find(platform => platform.name === 'X')!.hosts;

      const hostname = URL.canParse(url) && new URL(url).hostname;
      if (!hostname || !xHosts.includes(hostname)) {
        response.sendError('Invalid X URL', 400);
        return;
      }

      try {
        const scraped = await XScraper.scrape(url);
        response.header('Cache-Control', `public, max-age=${calculateTTLSeconds(scraped.cacheTTL)}`);
        response.sendSuccess(scraped.data, 200);
      } catch (error) {
        if (error instanceof ScraperError) {
          response.sendError(error.message, 500);
        } else {
          throw error;
        }
      }
    }
  });
};