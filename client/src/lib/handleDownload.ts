import { get, type Writable } from 'svelte/store';
import type { ScraperResult } from '$lib/types';
import addToast from '$stores/toastStore';
import handleErrorMessage from '$lib/handleErrorMessage';
import config from '$config';

export default async function handleDownload(
  urlStore: Writable<string>,
  scraperNameStore: Writable<string>,
  detailsStore: Writable<ScraperResult | object>,
  isLoadingStore: Writable<boolean>
) {
  detailsStore.set({});

  const url = get(urlStore);

  if (!url?.trim()) {
    addToast('Please enter a URL', { type: 'error' });
    return;
  }

  const isProperUrl = URL.canParse(url);
  if (!isProperUrl) {
    addToast('Please enter a valid URL', { type: 'error' });
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

    addToast(message, { type: 'error' });
    return;
  }

  urlStore.set('');

  const scraperName = response.url.split('/').pop()!;
  scraperNameStore.set(scraperName);

  const responseData = (await response.json()).data;
  detailsStore.set(responseData);
}