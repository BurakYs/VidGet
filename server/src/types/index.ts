export type ScraperResult = {
  allowQuickDownload: boolean;
  post: {
    assets: Array<{
      cover: string;
      download: string | null;
    }>
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

export type ScraperReturnData = { data: ScraperResult, cacheTTL?: number };