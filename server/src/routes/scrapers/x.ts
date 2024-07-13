import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import ScraperError from '@/utils/classes/ScraperError';
import XScraper from '@/utils/scrapers/x';

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

      const xHosts = ['twitter.com', 'x.com', 't.co'];

      const hostname = URL.canParse(url) && new URL(url).hostname;
      if (!hostname || !xHosts.includes(hostname)) {
        response.sendError('Invalid X URL', 400);
        return;
      }

      try {
        const scraped = await XScraper.scrape(url);
        response.sendSuccess(scraped, 200);
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
