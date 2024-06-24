import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import ScraperError from '@/utils/classes/ScraperError';
import TiktokScraper from '@/utils/scrapers/tiktok';

import type { ScrapeVideo } from '@/schemas/scrapers/tiktok';
import { scrapeVideo } from '@/schemas/scrapers/tiktok';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/',
        schema: {
            body: scrapeVideo
        },
        handler: async (request: Request, response: Response) => {
            const { url } = request.body as ScrapeVideo;

            const tiktokHosts = [
                'tiktok.com',
                'www.tiktok.com',
                'vm.tiktok.com'
            ];

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
                    response.sendError(error.message, 400);
                } else {
                    throw error;
                }
            }
        }
    });
};