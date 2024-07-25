import { get, type Writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import handleErrorMessage from '$lib/handleErrorMessage';
import config from '$config';
import detailsStore from './stores/details';
import { settings as settingsStore } from '$lib/stores/settings';
import saveFile from '$lib/saveFile';

import type { ScraperResult } from '$lib/types';

export default async function handleDownload(
  urlStore: Writable<string>,
  scraperNameStore: Writable<string>,
  isLoadingStore: Writable<boolean>
) {
  const url = get(urlStore);

  if (!url?.trim()) {
    toast.error('Please enter a URL');
    return;
  }

  const isProperUrl = URL.canParse(url);
  if (!isProperUrl) {
    toast.error('Please enter a valid URL');
    return;
  }

  isLoadingStore.set(true);

  const response = await fetch(`${config.apiUrl}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url.replace(/http:\/\//, 'https://') })
  }).catch(() => null);

  isLoadingStore.set(false);

  if (!response || !response.ok) {
    const message = await handleErrorMessage(response);

    toast.error(message);
    return;
  }

  urlStore.set('');

  const scraperName = response.url.split('/').pop()!;
  scraperNameStore.set(scraperName);

  const responseData = (await response.json()).data as ScraperResult;

  const settings = get(settingsStore);

  if (settings.quickDownload && responseData.allowQuickDownload) {
    const quickDownloadUrl = settings.quickDownloadType === 'video_picture' ? responseData.post.assets[0].download : responseData.audio?.download;
    if (quickDownloadUrl) {
      await saveFile(quickDownloadUrl, undefined);
      return;
    }
  }

  detailsStore.set(responseData);
}