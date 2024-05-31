import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import fs from 'fs';

const favicon = fs.readFileSync('./public/favicon.ico');

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: async (request: Request, response: Response) => {
            response.code(200).send('ok');
        }
    });

    fastify.route({
        method: 'GET',
        url: '/healthcheck',
        handler: async (request: Request, response: Response) => {
            response.code(200).send('ok');
        }
    });

    fastify.route({
        method: 'GET',
        url: '/favicon.ico',
        handler: async (request: Request, response: Response) => {
            response.code(200).send(favicon);
        }
    });
};