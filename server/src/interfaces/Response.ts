import { FastifyReply } from 'fastify';

export type SendFunction = (message: unknown, status: number, otherProperties?: Record<string, unknown>) => Response;

export default interface Response extends FastifyReply {
  sendSuccess: SendFunction;
  sendError: SendFunction;
}
