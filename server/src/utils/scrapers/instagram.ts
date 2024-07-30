// Made possible thanks to https://github.com/imputnet/cobalt

import Cookie from '@/utils/classes/Cookie';
import NodeCache from 'node-cache';
import axios, { RawAxiosRequestHeaders } from 'axios';
import scraperConfig from '@/config/scraper';
import instagramConfig from './instagram.config';
import fs from 'fs';
import ScraperError from '@/utils/classes/ScraperError';
import cacheAsset from '@/utils/cacheAsset';
import { ScraperResult, ScraperReturnData } from '@/types';

const cache = new NodeCache({ stdTTL: scraperConfig.standardCacheTTL });

const cachedDtsg = {
  value: '',
  expiry: 0
};

const instagramCookies = fs.existsSync('./cookies.json') ? JSON.parse(fs.readFileSync('./cookies.json', 'utf-8')).instagram : null;

export default class InstagramScraper {
  static async scrape(url: string) {
    const isReel = url.includes('/reel/') || url.includes('/p/');
    if (isReel) {
      const id = url.split('/')[4];
      if (!id) throw new ScraperError('You must provide a valid Instagram post URL');

      const cachedData = cache.get(id);
      if (cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(id) };

      return await this.getPost(id);
    }

    const isStory = url.includes('/stories/');
    if (isStory) {
      const username = url.split('/')[4];
      const storyId = url.split('/')[5];

      if (!username || !storyId) throw new ScraperError('You must provide a valid Instagram story URL');

      const cachedData = cache.get(storyId);
      if (cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(storyId) };

      return await this.getStory(username, storyId);
    }

    throw new ScraperError('We do not support this type of Instagram URL');
  }

  static async getPost(id: string): Promise<ScraperReturnData> {
    const cachedData = cache.get(id);
    if (cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(id) };

    let data, result;

    try {
      const cookie = instagramCookies && new Cookie(instagramCookies);

      const media_id = await this.getMediaId(id, cookie);

      if (media_id && cookie && !data) data = await this.requestMobileApi(media_id, cookie);
      if (media_id && !data) data = await this.requestMobileApi(media_id);

      if (!data && cookie) data = await this.requestGQL(id, cookie);
      if (!data) data = await this.requestGQL(id);
    } catch { /* empty */ }

    if (!data) throw new ScraperError('Failed to fetch post details. Please try again later');

    if (data?.gql_data) {
      result = await this.extractOldPost(data, id);
    } else {
      result = await this.extractNewPost(data, id);
    }

    if (!result) throw new ScraperError('Failed to fetch post details. Please try again later');

    const assets = result.flat(1);

    const finalData: ScraperResult = {
      allowQuickDownload: assets.length === 1,
      post: {
        assets
      },
      author: {
        username: data.owner?.username,
        nickname: data.owner?.full_name,
        profilePicture: (await this.downloadAsset(data.owner?.profile_pic_url, `${data.owner?.id}.jpg`))!
      }
    };

    cache.set(id, finalData);

    return { data: finalData };
  }

  static async getStory(username: string, id: string): Promise<ScraperReturnData> {
    const cachedData = cache.get(id);
    if (cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(id) };

    const cookie = instagramCookies && new Cookie(instagramCookies);
    if (!cookie?.toString()) throw new ScraperError('Story download is disabled for now');

    const userId = await this.usernameToId(username, cookie);
    if (!userId) throw new ScraperError('Failed to fetch story details. Please try again later');

    const dtsgId = await this.findDtsgId(cookie);

    const url = new URL('https://www.instagram.com/api/graphql/');
    const requestData = {
      fb_dtsg: dtsgId,
      jazoest: '26438',
      variables: JSON.stringify({
        reel_ids_arr: [userId]
      }),
      server_timestamps: true,
      doc_id: '25317500907894419'
    };

    let media;
    try {
      const data = (await this.request(url.toString(), cookie, 'POST', requestData));
      media = data?.data?.xdt_api__v1__feed__reels_media?.reels_media?.find((m: any) => m.id === userId);
    } catch { /* empty */ }

    const item = media.items.find((m: any) => m.pk === id);
    if (!item) throw new ScraperError('Failed to fetch story details. Please try again later');

    if (item.video_versions) {
      const video = item.video_versions.reduce((a: any, b: any) => a.width * a.height < b.width * b.height ? b : a);
      const data: ScraperResult = {
        allowQuickDownload: true,
        post: {
          assets: [{
            cover: (await this.downloadAsset(video.url, `${id}.jpg`))!,
            download: (await this.downloadAsset(video.url, `${id}.mp4`))!
          }]
        }
      };

      cache.set(id, data);

      return { data };
    }

    if (item.image_versions2?.candidates) {
      const data: ScraperResult = {
        allowQuickDownload: true,
        post: {
          assets: [{
            cover: (await this.downloadAsset(item.image_versions2.candidates[0].url, `${id}.jpg`))!,
            download: (await this.downloadAsset(item.image_versions2.candidates[0].url, `${id}.jpg`))!
          }]
        }
      };

      cache.set(id, data);

      return { data };
    }

    throw new ScraperError('Failed to fetch story details. Please try again later');
  }

  static async findDtsgId(cookie: Cookie) {
    try {
      if (cachedDtsg.expiry > Date.now()) return cachedDtsg.value;

      const { data } = await axios.get('https://www.instagram.com/', {
        headers: {
          ...instagramConfig.commonHeaders,
          Cookie: cookie.toString()
        }
      });

      const token = data.match(/"dtsg":{"token":"(.*?)"/)[1];

      cachedDtsg.value = token;
      cachedDtsg.expiry = Date.now() + 86390000;

      if (token) return token;
      return false;
    } catch { /* empty */ }
  }

  static async getMediaId(id: string, cookie?: Cookie, token?: string) {
    const oembedURL = new URL('https://i.instagram.com/api/v1/oembed/');
    oembedURL.searchParams.set('url', `https://www.instagram.com/p/${id}/`);

    const { data: oembed } = await axios.get(oembedURL.toString(), {
      headers: {
        ...instagramConfig.mobileHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(cookie && { Cookie: cookie.toString() })
      }
    });

    return oembed?.media_id;
  }

  static async usernameToId(username: string, cookie: Cookie) {
    const url = new URL('https://www.instagram.com/api/v1/users/web_profile_info/');
    url.searchParams.set('username', username);

    try {
      const data = await this.request(url.toString(), cookie);
      return data?.data?.user?.id;
    } catch { /* empty */ }
  }

  static async request(url: string, cookie: Cookie, method = 'GET', requestData: Record<string, any> = {}) {
    const { cookies } = cookie;

    const headers: RawAxiosRequestHeaders = {
      ...instagramConfig.commonHeaders,
      'x-ig-www-claim': cookies._wwwClaim || '0',
      'x-csrftoken': cookies.csrftoken,
      Cookie: cookie?.toString()
    };

    if (method === 'POST') {
      headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    const data = await axios(url, {
      method,
      headers,
      data: requestData && new URLSearchParams(requestData)
    });

    const wwwClaim = data.headers['x-ig-set-www-claim'];
    if (wwwClaim)
      cookie.cookies._wwwClaim = wwwClaim;

    cookie.setCookies(data.headers['set-cookie']!);

    return data.data;
  }

  static async requestMobileApi(mediaId: string, cookie?: Cookie, token?: string) {
    const { data: mediaInfo } = await axios.get(`https://i.instagram.com/api/v1/media/${mediaId}/info/`, {
      headers: {
        ...instagramConfig.mobileHeaders,
        ...(token && { authorization: `Bearer ${token}` }),
        ...(cookie && { cookie: cookie.toString() })
      }
    });

    return mediaInfo?.items?.[0];
  }

  static async requestGQL(id: string, cookie?: Cookie) {
    const dtsgId = cookie?.toString() ? await this.findDtsgId(cookie) : '';

    const url = new URL('https://www.instagram.com/api/graphql/');

    const requestData: Record<string, string> = {
      jazoest: '26406',
      variables: JSON.stringify({
        shortcode: id,
        __relay_internal__pv__PolarisShareMenurelayprovider: false
      }),
      doc_id: '7153618348081770'
    };

    if (dtsgId) requestData.fb_dtsg = dtsgId;

    const asd = (await this.request(url.toString(), cookie!, 'POST', requestData))
      .data
      ?.xdt_api__v1__media__shortcode__web_info
      ?.items
      ?.[0];

    return asd;
  }

  static async extractOldPost(data: Record<string, any>, id: string) {
    const sidecar = data?.gql_data?.shortcode_media?.edge_sidecar_to_children;
    if (sidecar) {
      const images = sidecar.edges.filter((e: any) => e.node?.display_url)
        .map(async (e: any, i: number) => {
          const type = e.node?.is_video ? 'video' : 'photo';
          const url = type === 'video' ? e.node?.video_url : e.node?.display_url;

          return {
            cover: await this.downloadAsset(e.node?.display_url, `${id}_${i}.jpg`),
            download: await this.downloadAsset(url, `${id}_${i}.${type === 'video' ? 'mp4' : 'jpg'}`)
          };
        });

      if (images.length) return await Promise.all(images);
    } else {
      const video = data?.gql_data?.shortcode_media?.video_url;
      const image = data?.gql_data?.shortcode_media?.display_url;

      const asset = await this.downloadAsset(video || image, `${id}.${video ? 'mp4' : 'jpg'}`);

      return [{
        cover: image ? await this.downloadAsset(image, `${id}.jpg`) : null,
        download: asset
      }];
    }
  }

  static async extractNewPost(data: Record<string, any>, id: string) {
    const carousel = data.carousel_media;
    if (carousel) {
      const images = carousel.filter((e: any) => e?.image_versions2)
        .map(async (e: any, i: number) => {
          const type = e.video_versions ? 'video' : 'photo';
          const imageUrl = e.image_versions2.candidates[0].url;

          let url = imageUrl;

          if (type === 'video') {
            const video = e.video_versions.reduce((a: any, b: any) => a.width * a.height < b.width * b.height ? b : a);
            url = video.url;
          }

          return [{
            cover: await this.downloadAsset(imageUrl, `${id}_${i}.jpg`),
            download: await this.downloadAsset(url, `${id}_${i}.${type === 'video' ? 'mp4' : 'jpg'}`)
          }];
        });

      if (images.length) return await Promise.all(images);
    } else {
      const video = data.video_versions && data.video_versions.reduce((a: any, b: any) => a.width * a.height < b.width * b.height ? b : a);
      const image = data.image_versions2?.candidates && data.image_versions2.candidates[0].url;

      const asset = await this.downloadAsset(video?.url || image, `${id}.${video ? 'mp4' : 'jpg'}`);

      return [{
        cover: image ? await this.downloadAsset(image, `${id}.jpg`) : null,
        download: asset
      }];
    }
  }

  static async downloadAsset(url: string, name: string) {
    return await cacheAsset(url, 'instagram/' + name);
  }
}