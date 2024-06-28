import { FastifyReply } from 'fastify';

export default interface Response extends FastifyReply {
  sendSuccess: (
    message: unknown,
    status: number,
    otherProperties?: Record<string, unknown>,
  ) => this;
  sendError: (
    message: unknown,
    status: number,
    otherProperties?: Record<string, unknown>,
  ) => this;
}
