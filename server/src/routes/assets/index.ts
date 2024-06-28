import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import getMimeType from '@/utils/getMimeType';
import fs from 'fs/promises';
import path from 'path';

import type { AssetParams } from '@/schemas/assets';
import { assetParams } from '@/schemas/assets';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/*',
    schema: {
      params: assetParams,
    },
    handler: async (request: Request, response: Response) => {
      const params = request.params as AssetParams;
      const name = params['*'];

      const requestedPath = path.resolve(`./public/${name}`);
      if (!requestedPath.startsWith(path.resolve('./public'))) {
        response.sendError('File not found', 404);
        return;
      }

      const file = await fs.readFile(`./public/${name}`).catch(() => null);
      if (!file) {
        response.sendError('File not found', 404);
        return;
      }

      const extension = name.slice(name.lastIndexOf('.'));
      response.header('Content-Type', getMimeType(extension));
      response.header('Content-Disposition', `attachment; filename=${name}`);

      response.code(200).send(file);
    },
  });
};
