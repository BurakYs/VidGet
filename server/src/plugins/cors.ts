import fp from 'fastify-plugin';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import appConfig from '@/config/app';

const cors = fp(async (fastify) => {
    fastify.register(fastifyCors, {
        origin: [appConfig.frontEndUrl, 'http://localhost:5173'],
    } as FastifyCorsOptions);
});

export default cors;