import './fastify';
import { SendFunction } from '@/interfaces/Response';

declare module 'fastify' {
  interface FastifyRequest {
    clientIp: string;
  }

  interface FastifyReply {
    sendSuccess: SendFunction;
    sendError: SendFunction;
  }
}
