import { type Writable, get } from 'svelte/store';
import { addToast } from '$stores/toastStore';
import formatNumber from '$lib/formatNumber';
import config from '$config';

export async function handleDownload(
    urlStore: Writable<string>,
    scraperNameStore: Writable<string>,
    detailsStore: Writable<any>,
    isLoadingStore: Writable<boolean>
) {
    if (!get(urlStore)?.trim()) {
        addToast('Please enter a URL', 'error');
        return;
    }

    const isProperUrl = URL.canParse(get(urlStore));
    if (!isProperUrl) {
        addToast('Please enter a valid URL', 'error');
        return;
    }

    const parsedUrl = new URL(get(urlStore));
    const hostData = config.scrapers.supportedHosts.find(x => x.host.includes(parsedUrl.hostname));
    if (!hostData) {
        addToast('We don\'t support this platform', 'error');
        return;
    }

    const scraperName = hostData.name;
    scraperNameStore.set(scraperName);

    isLoadingStore.set(true);
    const response = await fetch(`${config.rootUrl}/scrapers/${scraperName.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: get(urlStore).replace(/http:\/\//, 'https://') })
    }).catch(() => null);
    isLoadingStore.set(false);

    if (!response || !response.ok) {
        const isJson = response && response.headers.get('content-type')?.includes('application/json');
        const message = isJson && response ? (await response.json()).error : 'An unknown error occurred';
        addToast(message, 'error');
        return;
    }

    urlStore.set('');
    const responseData = (await response.json()).data;

    for (const key in responseData.stats) {
        responseData.stats[key] = formatNumber(responseData.stats[key]);
    }

    detailsStore.set(responseData);
}