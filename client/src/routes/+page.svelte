<svelte:head>
    <title>VidGet</title>
</svelte:head>

<script lang="ts">
    import SkeletonLoader from '$components/SkeletonLoader/Details.svelte';
    import ScraperDownloadButton from '$components/Scraper/DownloadButton.svelte';
    import { addToast } from '$stores/toastStore';
    import { formatNumber } from '$lib';
    import config from '$config';

    let isLoading = false;
    let url = '';
    let details: Record<string, any>;

    async function handleDownload() {
        if (!isLoading) {
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
            const isSupportedHost = config.scrapers.supportedHosts.includes(parsedUrl.hostname);
            if (!isSupportedHost) {
                addToast('We don\'t support this platform', 'error');
                return;
            }

            isLoading = true;
            const response = await fetch(`${config.rootUrl}/scrapers/tiktok`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url.replace('http://', 'https://') })
            }).catch(() => null);
            isLoading = false;

            if (!response || !response.ok) {
                const isJson = response && response.headers.get('content-type')?.includes('application/json');
                const message = isJson ? (await response.json()).error : 'An unknown error occurred';
                addToast(message, 'error');
                return;
            }

            url = '';

            details = (await response.json()).data;
            for (const key in details.stats) {
                details.stats[key] = formatNumber(details.stats[key]);
            }
        }
    }
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-white">
    <h1 class="text-5xl font-semibold mb-2">Start Downloading</h1>
    <p class="mb-8 text-secondary-text">No ads, no tracking, no nothing. Download now.</p>
    <div class="flex flex-col md:flex-row items-center w-full max-w-2xl mb-6 space-y-4 md:space-y-0">
        <input
                type="text"
                bind:value={url}
                on:keydown={(e) => e.key === 'Enter' && handleDownload()}
                placeholder="Download from TikTok, Instagram or Twitter"
                class="p-4 rounded-md w-full md:mr-4 bg-secondary outline-none"
        />
        <button
                class="bg-secondary text-white p-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-opacity duration-500"
                on:click={handleDownload}
                disabled={isLoading}
                class:opacity-50={isLoading}
        >
            <img src="{config.cdnUrl}/download.svg" alt="Download icon" class="w-6 h-6"/>
            <span>Download</span>
        </button>
    </div>

    <p class="text-sm text-gray-500 mb-8">
        By using our Service you agree to our <a href="/legal/terms" class="underline">Terms of Service</a>
        and <a href="/legal/privacy" class="underline">Privacy Policy</a>.</p>

    {#if isLoading}
        <SkeletonLoader/>
    {/if}

    {#if details && !isLoading}
        <div class="bg-secondary flex w-full max-w-4xl max-h-[32rem]">
            <div class="w-1/3">
                <img src={details.video.cover} alt="Cover" class="object-cover h-full w-full">
            </div>
            <div class="w-2/3 flex flex-col items-start ml-4 mt-3">
                <p class="text-3xl font-semibold">{details.author.username}</p>
                <p class="mt-2">{details.video.description.replace(/#\S+/g, '').trim()}</p>

                <div class="mt-auto flex flex-col items-start space-y-2 mb-4">
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/view.svg" alt="Views" class="h-6 w-6 mr-2"
                             style="fill: white">
                        <span>{details.stats.plays}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/like.svg" alt="Likes" class="h-6 w-6 mr-2">
                        <span>{details.stats.likes}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/comment.svg" alt="Comments" class="h-6 w-6 mr-2">
                        <span>{details.stats.comments}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/share.svg" alt="Shares" class="h-6 w-6 mr-2">
                        <span>{details.stats.shares}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start ml-4 mt-3 mr-6">
                <p class="text-3xl font-semibold mb-3">Downloads</p>
                <ScraperDownloadButton {details} key="video.withoutWatermark" text="No Watermark"/>
                <ScraperDownloadButton {details} key="video.withWatermark" text="Watermark"/>
                <ScraperDownloadButton {details} key="music.playUrl" text="Only Sound"/>
            </div>
        </div>
    {/if}
</div>