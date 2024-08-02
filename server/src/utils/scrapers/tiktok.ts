import type { ScraperResult, ScraperReturnData } from '@/types';
import Cookie from '@/utils/classes/Cookie';
import ScraperError from '@/utils/classes/ScraperError';
import NodeCache from 'node-cache';
import cacheAsset from '@/utils/cacheAsset';
import axios from 'axios';
import scraperConfig from '@/config/scraper';

const cache = new NodeCache({ stdTTL: scraperConfig.standardCacheTTL });

export default class TikTokScraper {
  static async scrape(postUrl: string) {
    const url = new URL(postUrl);

    if (url.hostname === 'tiktok.com') {
      const id = postUrl.split('/')[5].split('?')[0];
      return await this.scrapePost(id);
    }

    const response = await axios.get(postUrl, {
      headers: {
        'User-Agent': scraperConfig.defaultUserAgent
      }
    });

    const finalUrl = response.request.res.responseUrl;
    const id = finalUrl.split('/')[5].split('?')[0];
    return await this.scrapePost(id);
  }

  static async scrapePost(postId: string): Promise<ScraperReturnData> {
    const cachedData = cache.get(postId);
    if (process.env.NODE_ENV === 'production' && cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(postId) };

    const cookieManager = new Cookie();

    const response = await axios.get(`https://tiktok.com/@i/video/${postId}`, {
      headers: {
        'User-Agent': scraperConfig.defaultUserAgent,
        Cookie: cookieManager.toString()
      }
    });

    cookieManager.addMany(response.headers['set-cookie']!);

    let details: Record<string, any> = {};

    try {
      const data = response.data.split('<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1].split('</script>')[0];
      details = JSON.parse(data)['__DEFAULT_SCOPE__']['webapp.video-detail']['itemInfo']['itemStruct'];
    } catch {
      throw new ScraperError('Failed to fetch post details. Please try again later');
    }

    let assets: ScraperResult['post']['assets'];

    const slideshows = details.imagePost?.images;
    const isSlideshow = !!slideshows;

    if (isSlideshow) {
      const slideshowUrls = slideshows.map((x: any) => x.imageURL.urlList[0]);
      const images = await Promise.all(slideshowUrls.map((x: string, i: number) => this.downloadAsset(x, `${postId}_${i}.jpg`, cookieManager.toString())));

      assets = images.map(x => ({ cover: x, download: x }));
    } else {
      const playUrl = await this.downloadAsset(details.video.playAddr, `${postId}.mp4`, cookieManager.toString());

      assets = [{ cover: details.video.cover, download: playUrl }];
    }

    const data: ScraperResult = {
      allowQuickDownload: !isSlideshow || (isSlideshow && slideshows.length === 1),
      post: {
        assets
      },
      author: {
        username: details.author.uniqueId,
        nickname: details.author.nickname,
        profilePicture: details.author.avatarLarger
      },
      audio: {
        title: details.music.title,
        author: details.music.authorName,
        original: details.music.original,
        cover: details.music.coverLarge,
        duration: details.music.duration,
        download: await this.downloadAsset(details.music.playUrl, `${details.music.id}.mp3`, cookieManager.toString())
      }
    };

    cache.set(postId, data);

    return { data };
  }

  static async downloadAsset(url: string, name: string, cookie: string) {
    return await cacheAsset(url, 'tiktok/' + name, {
      'User-Agent': scraperConfig.defaultUserAgent,
      'Cookie': cookie
    });
  }
}