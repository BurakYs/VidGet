import type { FastifyInstance } from 'fastify';
import type { Request, Response } from '@/types';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (_request: Request, response: Response) => {
      response.code(200).send('OK');
    }
  });
};