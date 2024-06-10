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

            const file = await fs.readFile(`./public/${platform}/${name}`).catch(() => null);
            if (!file) {
                response.sendError('File not found', 404);
                return;
            }

            const extension = name.slice(name.lastIndexOf('.'));
            response.header('Content-Type', getMimeType(extension));
            response.header('Content-Disposition', `attachment; filename=${name}`);
            response.code(200).send(file);
        }
    });
};