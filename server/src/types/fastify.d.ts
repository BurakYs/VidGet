import type { SendCustomResponse } from '@/types';

declare module 'fastify' {
  interface FastifyRequest {
    clientIp: string;
  }

  interface FastifyReply {
    sendSuccess: SendCustomResponse;
    sendError: SendCustomResponse;
  }
}