import fp from 'fastify-plugin';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import appConfig from '@/config/app';

const cors = fp(async (fastify) => {
    fastify.register(fastifyCors, {
        origin: appConfig.productionUrl
    } as FastifyCorsOptions);
});

export default cors;