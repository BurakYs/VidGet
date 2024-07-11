import { FastifyReply } from 'fastify';

export type Translatable = {
  code: string;
  message: string;
  variables?: Record<string, string | number>;
}

export type SendFunction = (
  message: Translatable | unknown,
  status: number,
  otherProperties?: Record<string, unknown>
) => Response;

export default interface Response extends FastifyReply {
  sendSuccess: SendFunction;
  sendError: SendFunction;
}
