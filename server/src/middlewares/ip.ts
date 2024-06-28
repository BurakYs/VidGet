import { FastifyRequest } from 'fastify';

export default function ip(request: FastifyRequest) {
  const headersToCheck = [
    'x-client-ip',
    'x-forwarded-for',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
  ];

  return (
    headersToCheck.reduce(
      (acc: string | undefined, header: string): string | undefined => {
        return acc || (request.headers[header] as string);
      },
      undefined,
    ) ||
    request.socket?.remoteAddress ||
    request.ip
  );
}
