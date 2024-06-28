import { Page, ResourceType } from 'puppeteer';
import ScraperError from '@/utils/classes/ScraperError';

export default async function (page: Page, maxRequests: number = 50) {
  let requestCount = 0;

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    requestCount++;
    const isMaxed = requestCount >= maxRequests;
    if (isMaxed) throw new ScraperError('Max requests reached');

    const unallowedResources: ResourceType[] = [
      'stylesheet',
      'image',
      'media',
      'font',
      'script',
      'texttrack',
      'xhr',
      'fetch',
      'prefetch',
      'eventsource',
      'websocket',
      'manifest',
      'signedexchange',
      'ping',
      'cspviolationreport',
      'preflight',
      'other',
    ];
    const isJsFile = req.url().endsWith('.js');
    if (
      unallowedResources.includes(req.resourceType()) ||
      isJsFile ||
      isMaxed
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
}
