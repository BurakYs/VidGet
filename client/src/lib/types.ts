export type APIResponse<S = true> = {
  success: S;
  status: number;
  data: S extends true ? unknown : never;
  error: S extends false ? string : never;
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
  reducedMotion: boolean;
}>