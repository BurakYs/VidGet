import type { FastifyInstance } from 'fastify';
import type { Request, Response, ScraperReturnData } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import TiktokScraper from '@/utils/scrapers/tiktok';
import XScraper from '@/utils/scrapers/x';
import calculateTTLSeconds from '@/utils/calculateTTLSeconds';
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

      const scrapers = {
        tiktok: TiktokScraper,
        x: XScraper
      };

      try {
        const scraped = await scrapers[scraper.name as keyof typeof scrapers].scrape(url) as ScraperReturnData;
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