import './fastify';

declare module 'fastify' {
  interface FastifyRequest {
    clientIp: string;
  }

  interface FastifyReply {
    sendSuccess: (
      message: unknown,
      status: number,
      otherProperties?: Record<string, unknown>,
    ) => FastifyReply;
    sendError: (
      message: unknown,
      status: number,
      otherProperties?: Record<string, unknown>,
    ) => FastifyReply;
  }
}
