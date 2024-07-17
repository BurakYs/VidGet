import { FastifyReply, FastifyRequest } from 'fastify';

export type SendCustomResponse = (message: unknown, status: number, otherProperties?: Record<string, unknown>) => Response;

export type Request = FastifyRequest & {
  clientIp: string;
}

export type Response = FastifyReply & {
  sendSuccess: SendCustomResponse;
  sendError: SendCustomResponse;
}

export type ScraperResult = {
  post: {
    id: string;
    description?: string;
    assets: Array<{
      type?: string;
      cover: string;
      download?: string | null;
    }>
  };
  author: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
  };
  audio?: {
    id: string;
    title: string;
    author?: string;
    original?: boolean;
    cover: string;
    duration: number;
    download?: string | null;
  };
  stats?: Partial<{
    likes: number;
    shares: number;
    comments: number;
    plays: number;
    favorites: number;
    reposts: number;
  }>;
}

export type ScraperReturnData = { data: ScraperResult, cacheTTL?: number };