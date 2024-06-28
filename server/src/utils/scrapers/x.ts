import ScraperError from '@/utils/classes/ScraperError';
import puppeteer from 'puppeteer';
import axios from 'axios';
import applyPuppeteerInterception from '@/utils/applyPuppeteerInterception';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnObject = Record<string, any>;

export default class XScraper {
  static async scrape(postUrl: string) {
    const url = new URL(postUrl);
    if (url.hostname === 't.co') {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await applyPuppeteerInterception(page);

      await page.goto(postUrl);
      const finalUrl = page.url();
      await browser.close();

      return await this.scrapePost(finalUrl);
    }

    return await this.scrapePost(postUrl);
  }

  static async scrapePost(postUrL: string) {
    const id = postUrL.split('/')[5].split('?')[0];

    if (isNaN(Number(id))) throw new ScraperError('Invalid post ID');

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
        'tfw_tweet_edit_frontend:on',
      ].join(';'),
    );
    url.searchParams.set('token', token);

    const response = await axios.get(url.toString());
    if (response.status !== 200)
      throw new ScraperError('Failed to fetch post data');

    const tombstoneErrors = [
      {
        prefix: 'Age-restricted',
        description: 'Cannot fetch age-restricted content',
      },
    ];

    const postData = response.data;
    const tombstone =
      postData.tombstone &&
      tombstoneErrors.find((error) =>
        postData.tombstone.text.text.startsWith(error.prefix),
      );
    if (tombstone || postData.tombstone)
      throw new ScraperError(
        tombstone?.description || 'Failed to fetch post data',
      );

    return {
      post: {
        id: postData.id_str,
        text: postData.text,
        favoriteCount: postData.favorite_count,
        media: postData.mediaDetails?.map((media: AnObject) => ({
          shortUrl: media.display_url.startsWith('http')
            ? media.display_url
            : `https://${media.display_url}`,
          expandedUrl: media.expanded_url,
          poster: media.poster || media.media_url_https || undefined,
          videoDuration:
            media.type === 'video' ? media.duration_millis : undefined,
          url:
            media.type === 'photo'
              ? media.media_url_https
              : media.video_info.variants
                  .sort(
                    (a: AnObject, b: AnObject) =>
                      (b.bitrate || 0) - (a.bitrate || 0),
                  )
                  .find(
                    (variant: AnObject) => variant.content_type === 'video/mp4',
                  ).url ||
                media.video_info.variants.sort(
                  (a: AnObject, b: AnObject) =>
                    (b.bitrate || 0) - (a.bitrate || 0),
                )[0].url,
          type: media.type,
        })),
      },
      author: {
        id: postData.user.id_str,
        username: postData.user.screen_name,
        name: postData.user.name,
        profilePicture: postData.user.profile_image_url_https.replace(
          '_normal.',
          '_400x400.',
        ),
        verified: postData.user.verified,
        verifiedType: postData.user.verified_type,
      },
    };
  }

  static getToken(id: string) {
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
  }
}
