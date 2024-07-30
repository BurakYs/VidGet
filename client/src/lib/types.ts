type SuccessData = unknown;

type ErrorData = string;

export type APIResponse<Success = true> = {
  success: Success;
  status: number;
  data: Success extends true ? SuccessData : null;
  error: Success extends false ? ErrorData : null;
}

export type ScraperAsset = {
  cover: string;
  download: string | null;
}

export type ScraperResult = {
  allowQuickDownload: boolean;
  post: {
    assets: Array<ScraperAsset>
  };
  author?: {
    username: string;
    nickname?: string;
    profilePicture: string;
  };
  audio?: {
    title: string;
    author?: string;
    original?: boolean;
    cover: string;
    duration: number;
    download: string | null;
  };
}

export type Theme = 'light' | 'dark';

export type Settings = Partial<{
  quickDownloadType: 'off' | 'video_picture' | 'audio';
  sendAnonymousData: boolean;
}>