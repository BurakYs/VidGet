import Cookie from '@/utils/classes/Cookie';
import ScraperError from '@/utils/classes/ScraperError';
import axios from 'axios';
import cacheAsset from '@/utils/cacheAsset';
import { ScraperResult } from '@/types';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

export default class TikTokScraper {
  static async scrape(postUrl: string) {
    const url = new URL(postUrl);

    if (url.hostname === 'tiktok.com') {
      const id = postUrl.split('/')[5].split('?')[0];
      return await this.scrapePost(id);
    }

    const response = await axios.get(postUrl, {
      headers: {
        'User-Agent': userAgent
      }
    });

    const finalUrl = response.request.res.responseUrl;
    const id = finalUrl.split('/')[5].split('?')[0];
    return await this.scrapePost(id);
  }

  static async scrapePost(postId: string) {
    const cookieManager = new Cookie();

    const response = await axios.get(`https://tiktok.com/@i/video/${postId}`, {
      headers: {
        'User-Agent': userAgent,
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
    const isSlideshow = !!details.imagePost?.images;

    if (isSlideshow) {
      const slideshows = details.imagePost.images.map((x: any) => x.imageURL.urlList[0]);
      const images = await Promise.all(slideshows.map((x: string, i: number) => this.downloadAsset(x, `${postId}_${i}.jpg`, cookieManager.toString())));

      assets = images.map(x => ({ cover: x, download: x }));
    } else {
      const { video } = details;

      const playUrl = await this.downloadAsset(details.video.playAddr, `${postId}.mp4`, cookieManager.toString());

      assets = [{ cover: video.cover, download: playUrl }];
    }

    return {
      type: isSlideshow ? 'slideshow' : 'video',
      post: {
        id: details.id,
        description: details.desc?.trim(),
        assets
      },
      author: {
        id: details.author.uid,
        username: details.author.uniqueId,
        nickname: details.author.nickname,
        avatar: details.author.avatarLarger
      },
      audio: {
        id: details.music.id,
        title: details.music.title,
        author: details.music.authorName,
        original: details.music.original,
        cover: details.music.coverLarge,
        duration: details.music.duration,
        download: await this.downloadAsset(details.music.playUrl, `${details.music.id}.mp3`, cookieManager.toString())
      },
      stats: {
        likes: Number(details.statsV2.diggCount),
        shares: Number(details.statsV2.shareCount),
        comments: Number(details.statsV2.commentCount),
        plays: Number(details.stats.playCount),
        favorites: Number(details.statsV2.shareCount),
        reposts: Number(details.statsV2.shareCount)
      }
    } as ScraperResult;
  }

  static async downloadAsset(url: string, name: string, cookie: string) {
    return await cacheAsset(url, 'tiktok/' + name, {
      'User-Agent': userAgent,
      Cookie: cookie
    });
  }
}