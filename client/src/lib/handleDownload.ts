import { addToast } from '$stores/toastStore';
import formatNumber from '$lib/formatNumber';
import config from '$config';

export async function handleDownload(
    url: string,
    setScraperName: (name: string) => void,
    setUrl: (url: string) => void,
    setDetails: (details: Record<string, any>) => void,
    setIsLoading: (loading: boolean) => void
) {
    if (!url.trim()) {
        addToast('Please enter a URL', 'error');
        return;
    }

    const isProperUrl = URL.canParse(url);
    if (!isProperUrl) {
        addToast('Please enter a valid URL', 'error');
        return;
    }

    const parsedUrl = new URL(url);
    const hostData = config.scrapers.supportedHosts.find(x => x.host.includes(parsedUrl.hostname));
    if (!hostData) {
        addToast('We don\'t support this platform', 'error');
        return;
    }

    const scraperName = hostData.name;
    setScraperName(scraperName);

    setIsLoading(true);
    const response = await fetch(`${config.rootUrl}/scrapers/${scraperName.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url.replace(/http:\/\//, 'https://') })
    }).catch(() => null);
    setIsLoading(false);

    if (!response || !response.ok) {
        const isJson = response && response.headers.get('content-type')?.includes('application/json');
        const message = isJson && response ? (await response.json()).error : 'An unknown error occurred';
        addToast(message, 'error');
        return;
    }

    setUrl('');
    const responseData = (await response.json()).data;

    for (const key in responseData.stats) {
        responseData.stats[key] = formatNumber(responseData.stats[key]);
    }

    setDetails(responseData);
}