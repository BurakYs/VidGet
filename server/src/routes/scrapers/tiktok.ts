import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import TiktokScraper from '@/utils/scrapers/tiktok';

import type { ScrapePost } from '@/schemas/scrapers/tiktok';
import { scrapePost } from '@/schemas/scrapers/tiktok';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: scrapePost
    },
    handler: async (request: Request, response: Response) => {
      const { url } = request.body as ScrapePost;

      const tiktokHosts = ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'];

      const hostname = URL.canParse(url) && new URL(url).hostname;
      if (!hostname || !tiktokHosts.includes(hostname)) {
        response.sendError('Invalid TikTok URL', 400);
        return;
      }

      try {
        const scraped = await TiktokScraper.scrape(url);
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