type SuccessData = unknown;

type ErrorData = string

export type APIResponse<Success = true> = {
  success: Success;
  status: number;
  data: Success extends true ? SuccessData : null;
  error: Success extends false ? ErrorData : null;
};

export type ScraperResult = {
  type: 'video' | 'slideshow';
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
  audio: {
    id: string;
    title: string;
    author?: string;
    original?: boolean;
    cover: string;
    duration: number;
    download: string;
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