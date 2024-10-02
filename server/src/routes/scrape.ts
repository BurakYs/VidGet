import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ScraperReturnData } from '@/types';
import scraperConfig from '@/config/scraper';

import ScraperError from '@/utils/classes/ScraperError';
import TiktokScraper from '@/utils/scrapers/tiktok';
import XScraper from '@/utils/scrapers/x';
import PinterestScraper from '@/utils/scrapers/pinterest';
import InstagramScraper from '@/utils/scrapers/instagram';

import type { ScrapePlatform } from '@/schemas/scrape';
import { scrapePlatform } from '@/schemas/scrape';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: scrapePlatform
    },
    handler: async (request: FastifyRequest, response: FastifyReply) => {
      const { url } = request.body as ScrapePlatform;

      const hostname = new URL(url).hostname;
      const scraper = scraperConfig.supportedPlatforms.find(platform =>
        platform.hosts.some(host => new RegExp(`^${host.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(hostname))
      );
      if (!scraper) return response.sendError('We don\'t support this platform yet', 400);

      const scrapers = {
        tiktok: TiktokScraper,
        x: XScraper,
        pinterest: PinterestScraper,
        instagram: InstagramScraper
      };

      try {
        const scraped = await scrapers[scraper.name.toLowerCase() as keyof typeof scrapers].scrape(url) as ScraperReturnData;
        const cacheMaxAge = scraped.cacheTTL ? Math.floor((scraped.cacheTTL - Date.now()) / 1000) : scraperConfig.standardCacheTTL;

        response.header('Cache-Control', `public, max-age=${cacheMaxAge}`);
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