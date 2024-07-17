import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import TiktokScraper from '@/utils/scrapers/tiktok';
import calculateTTLSeconds from '@/utils/calculateTTLSeconds';
import app from '@/config/app';

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

      const tiktokHosts = app.supportedPlatforms.find(platform => platform.name === 'TikTok')!.hosts;

      const hostname = URL.canParse(url) && new URL(url).hostname;
      if (!hostname || !tiktokHosts.includes(hostname)) return response.sendError('Invalid TikTok URL', 400);

      try {
        const scraped = await TiktokScraper.scrape(url);
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