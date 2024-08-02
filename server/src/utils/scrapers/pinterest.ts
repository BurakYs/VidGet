import type { ScraperResult, ScraperReturnData } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import axios, { AxiosResponse } from 'axios';
import scraperConfig from '@/config/scraper';
import cacheAsset from '@/utils/cacheAsset';

export default class PinterestScraper {
  static async scrape(postUrl: string) {
    let url = new URL(postUrl);
    let pageContent = '';

    if (url.hostname === 'pin.it') {
      const response = await axios.get(postUrl, {
        headers: {
          'User-Agent': scraperConfig.defaultUserAgent
        }
      });

      url = new URL(response.request.res.responseUrl);
      pageContent = response;
    }

    const id = url.href.split('/')[4].split('?')[0];
    return await this.scrapePost(id, pageContent);
  }

  static async scrapePost(postId: string, pageContent?: AxiosResponse): Promise<ScraperReturnData> {
    const { data, status } = pageContent || (await axios.get(`https://www.pinterest.com/pin/${postId}`, {
      headers: {
        'User-Agent': scraperConfig.defaultUserAgent
      }
    }));

    if (status !== 200 || data?.length < 50000) throw new ScraperError('Failed to fetch pin details. Please try again later');

    let details: Record<string, any>;

    try {
      const scriptData = JSON.parse(data.split('<script data-relay-response="true" type="application/json">')[1].split('</script>')[0]);
      details = scriptData.response.data.v3GetPinQuery.data;
    } catch {
      throw new ScraperError('Failed to fetch pin details. Please try again later');
    }

    const highestQualityVideoKey = details.videos?.videoList &&
      Object.keys(details.videos.videoList)
        .filter(k => k.startsWith('v') && k.endsWith('P'))
        .sort((a, b) => parseInt(b.slice(1, -1)) - parseInt(a.slice(1, -1)))[0];

    const videoUrl = highestQualityVideoKey && details.videos.videoList[highestQualityVideoKey].url;
    const video = videoUrl && await this.downloadAsset(videoUrl, postId + '.mp4');
    const coverUrl = details.imageSpec_orig.url;
    const cover = coverUrl && await this.downloadAsset(coverUrl, postId + coverUrl.split('.').pop());

    const pinner = details.nativeCreator || details.pinner;

    const result: ScraperResult = {
      allowQuickDownload: true,
      post: {
        assets: [{
          cover,
          download: video || cover
        }]
      },
      author: {
        username: pinner.username,
        profilePicture: pinner.imageLargeUrl || details.linkDomain?.officialUser?.imageMediumUrl
      }
    };

    return { data: result };
  }

  static async downloadAsset(url: string, name: string) {
    return await cacheAsset(url, 'pinterest/' + name, {
      'User-Agent': scraperConfig.defaultUserAgent
    });
  }

}