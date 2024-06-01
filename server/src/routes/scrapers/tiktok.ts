import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import tiktokScraper from '@/utils/scrapers/tiktok';

import type { ScrapeVideo } from '@/schemas/scrapers/tiktok';
import { scrapeVideo } from '@/schemas/scrapers/tiktok';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            querystring: scrapeVideo
        },
        handler: async (request: Request, response: Response) => {
            const query = request.query as ScrapeVideo;

            try {
                const scraped = await tiktokScraper.scrapeVideo(query.url);
                response.sendSuccess(scraped, 200);
            } catch (error) {
                if (error instanceof Error) {
                    response.sendError(error.message, 400);
                } else {
                    throw error;
                }
            }
        }
    });
};