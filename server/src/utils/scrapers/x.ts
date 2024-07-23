import type { ScraperResult, ScraperReturnData } from '@/types';
import ScraperError from '@/utils/classes/ScraperError';
import NodeCache from 'node-cache';
import axios from 'axios';
import scraperConfig from '@/config/scraper';

const cache = new NodeCache({ stdTTL: scraperConfig.standardCacheTTL });

export default class XScraper {
  static async scrape(postUrl: string): Promise<ScraperReturnData> {
    const id = postUrl.split('/')[5].split('?')[0];
    if (isNaN(Number(id))) throw new ScraperError('Invalid post ID');

    const cachedData = cache.get(id);
    if (cachedData) return { data: cachedData as ScraperResult, cacheTTL: cache.getTtl(id) };

    const token = this.getToken(id);
    const url = new URL('https://cdn.syndication.twimg.com/tweet-result');

    url.searchParams.set('id', id);
    url.searchParams.set('lang', 'en');
    url.searchParams.set(
      'features',
      [
        'tfw_timeline_list:',
        'tfw_follower_count_sunset:true',
        'tfw_tweet_edit_backend:on',
        'tfw_refsrc_session:on',
        'tfw_fosnr_soft_interventions_enabled:on',
        'tfw_show_birdwatch_pivots_enabled:on',
        'tfw_show_business_verified_badge:on',
        'tfw_duplicate_scribes_to_settings:on',
        'tfw_use_profile_image_shape_enabled:on',
        'tfw_show_blue_verified_badge:on',
        'tfw_legacy_timeline_sunset:true',
        'tfw_show_gov_verified_badge:on',
        'tfw_show_business_affiliate_badge:on',
        'tfw_tweet_edit_frontend:on'
      ].join(';')
    );
    url.searchParams.set('token', token);

    const response = await axios.get(url.toString());
    if (!response.data) throw new ScraperError('Failed to fetch post data');

    const tombstoneErrors = [
      {
        prefix: 'Age-restricted',
        error: new ScraperError('Cannot fetch age-restricted content')
      }
    ];

    const postData = response.data;
    const tombstoneError = postData.tombstone && tombstoneErrors.find((error) => postData.tombstone.text.text.startsWith(error.prefix));
    if (tombstoneError || postData.tombstone) throw tombstoneError.error || new ScraperError('Failed to fetch post data');

    if (!postData.mediaDetails?.length) throw new ScraperError('No media found in the post');

    const data: ScraperResult = {
      allowQuickDownload: false,
      post: {
        assets: postData.mediaDetails.map((media: any) => ({
          type: media.type,
          cover: media.poster || media.media_url_https || undefined,
          download:
            media.type === 'photo'
              ? media.media_url_https
              : media.video_info.variants
                .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))
                .find((variant: any) => variant.content_type === 'video/mp4').url ||
              media.video_info.variants.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0].url
        }))
      },
      author: {
        username: postData.user.screen_name,
        nickname: postData.user.name,
        avatar: postData.user.profile_image_url_https.replace('_normal.', '_400x400.')
      }
    };

    cache.set(id, data);

    return { data };
  }

  static getToken(id: string) {
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
  }
}