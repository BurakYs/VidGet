import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import fs from 'fs/promises';
import getMimeType from '@/utils/getMimeType';

import type { TiktokAsset } from '@/schemas/assets';
import { tiktokAsset } from '@/schemas/assets';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/:platform/:name',
        schema: {
            params: tiktokAsset
        },
        handler: async (request: Request, response: Response) => {
            const { platform, name } = request.params as TiktokAsset;

            const filePath = `./public/${platform}/${name}`;
            const file = await fs.readFile(filePath).catch(() => null);
            if (!file) {
                response.sendError('File not found', 404);
                return;
            }

            await fs.unlink(filePath).catch(() => null);
            const extension = name.slice(name.lastIndexOf('.'));
            response.header('Content-Type', getMimeType(extension));
            response.code(200).send(file);
        }
    });
};