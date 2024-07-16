type SuccessData = unknown;

type ErrorData = string

export type APIResponse<Success = true> = {
  success: Success;
  status: number;
  data: Success extends true ? SuccessData : null;
  error: Success extends false ? ErrorData : null;
};

export type ScraperPostAsset = {
  type?: string;
  cover: string;
  download?: string | null;
}

export type ScraperPost = {
  id: string;
  description?: string;
  assets: Array<ScraperPostAsset>
};

export type ScraperAuthor = {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
};

export type ScraperAudio = {
  id: string;
  title: string;
  author?: string;
  original?: boolean;
  cover: string;
  duration: number;
  download: string;
};

export type ScraperStats = Partial<{
  likes: number;
  shares: number;
  comments: number;
  plays: number;
  favorites: number;
  reposts: number;
}>;

export type ScraperResult = {
  type: 'video' | 'slideshow';
  post: ScraperPost;
  author: ScraperAuthor;
  audio: ScraperAudio;
  stats?: ScraperStats;
}