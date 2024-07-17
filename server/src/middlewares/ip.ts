import type { Request } from '@/types';

export default function ip(request: Request) {
  const headersToCheck = [
    'x-forwarded-for'
  ];

  request.clientIp = headersToCheck
    .reduce((prev: string, curr: string) => prev || (request.headers[curr] as string))
    || request.ip;
}
