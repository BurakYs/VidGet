import { get, type Writable } from 'svelte/store';
import addToast from '$stores/toastStore';
import handleErrorMessage from '$lib/handleErrorMessage';
import formatNumber from '$lib/formatNumber';
import config from '$config';

export default async function handleDownload(
  urlStore: Writable<string>,
  scraperNameStore: Writable<string>,
  detailsStore: Writable<any>,
  isLoadingStore: Writable<boolean>
) {
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

  const parsedUrl = new URL(url);
  const hostData = config.scrapers.supportedHosts.find(x => x.host.includes(parsedUrl.hostname));
  if (!hostData) {
    addToast('We don\'t support this platform yet', { type: 'error' });
    return;
  }

  const scraperName = hostData.name;
  scraperNameStore.set(scraperName);

  isLoadingStore.set(true);

  const response = await fetch(`${config.apiUrl}/scrapers/${scraperName.toLowerCase()}`, {
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

  const responseData = (await response.json()).data;
  for (const key in responseData.stats) {
    responseData.stats[key] = formatNumber(responseData.stats[key]);
  }

  detailsStore.set(responseData);
}