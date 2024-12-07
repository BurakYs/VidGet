import { FastifyReply } from 'fastify';

type SendCustomResponse = (message: unknown, status: number, otherProperties?: Record<string, unknown>) => FastifyReply;

declare module 'fastify' {
  interface FastifyRequest {
    clientIp: string;
  }

  interface FastifyReply {
    sendSuccess: SendCustomResponse;
    sendError: SendCustomResponse;
  }
}