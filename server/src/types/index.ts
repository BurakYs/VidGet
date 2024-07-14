import { FastifyReply, FastifyRequest } from 'fastify';

export type SendCustomResponse = (message: unknown, status: number, otherProperties?: Record<string, unknown>) => Response;

export type Request = FastifyRequest & {
  clientIp: string;
}

export type Response = FastifyReply & {
  sendSuccess: SendCustomResponse;
  sendError: SendCustomResponse;
}