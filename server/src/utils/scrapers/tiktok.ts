import Cookie from '@/utils/classes/Cookie';
import ScraperError from '@/utils/classes/ScraperError';
import axios from 'axios';
import cacheAsset from '@/utils/cacheAsset';

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

    const additionalData: Record<string, any> = {};
    const isSlideshow = !!details.imagePost?.images;

    if (isSlideshow) {
      const slideshows = details.imagePost.images.map((x: any) => x.imageURL.urlList[0]);
      const images = await Promise.all(slideshows.map((x: string, i: number) => this.downloadAsset(x, `${postId}_${i}.jpg`, cookieManager.toString())));

      additionalData.slideshow = { images };
    } else {
      const { video } = details;

      const [withoutWatermark, withWatermark] = await Promise.all([
        this.downloadAsset(details.video.playAddr, `${postId}.mp4`, cookieManager.toString()),
        this.downloadAsset(details.video.downloadAddr, `${postId}_watermark.mp4`, cookieManager.toString())
      ]);

      additionalData.video = {
        height: video.height,
        width: video.width,
        duration: video.duration,
        cover: video.cover,
        withoutWatermark,
        withWatermark
      };
    }

    return {
      ...additionalData,
      type: isSlideshow ? 'slideshow' : 'video',
      post: {
        id: details.id,
        description: details.desc?.trim(),
        createdAt: new Date(details.createTime * 1000).getTime()
      },
      author: {
        id: details.author.uid,
        username: details.author.uniqueId,
        nickname: details.author.nickname,
        avatar: details.author.avatarLarger
      },
      music: {
        id: details.music.id,
        title: details.music.title,
        author: details.music.authorName,
        original: details.music.original,
        cover: details.music.coverLarge,
        duration: details.music.duration,
        playUrl: await this.downloadAsset(details.music.playUrl, `${details.music.id}.mp3`, cookieManager.toString())
      },
      stats: {
        likes: Number(details.statsV2.diggCount),
        shares: Number(details.statsV2.shareCount),
        comments: Number(details.statsV2.commentCount),
        plays: Number(details.stats.playCount),
        favorites: Number(details.statsV2.shareCount),
        reposts: Number(details.statsV2.shareCount)
      }
    };
  }

  static async downloadAsset(url: string, name: string, cookie: string) {
    return await cacheAsset(url, 'tiktok/' + name, {
      'User-Agent': userAgent,
      Cookie: cookie
    });
  }
}