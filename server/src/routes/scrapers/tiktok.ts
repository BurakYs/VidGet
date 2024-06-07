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

            try {
                const tiktokScraper = new TiktokScraper();
                const scraped = await tiktokScraper.scrapeVideo(url);
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