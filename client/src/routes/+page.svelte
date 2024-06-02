<script lang="ts">
    import SkeletonLoader from '$components/SkeletonLoader/Details.svelte';
    import ScraperDownloadButton from '$components/Scraper/DownloadButton.svelte';
    import { formatNumber } from '$lib';
    import config from '$config';

    let isLoading = false;
    let url = '';
    let videoDetails: Record<string, any>;

    async function handleDownload() {
        if (url.trim() && !isLoading) {
            isLoading = true;
            const response = await fetch(`${config.rootUrl}/scrapers/tiktok`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                isLoading = false;
                console.error('Failed to fetch video details');
                return;
            }

            url = '';
            isLoading = false;

            videoDetails = (await response.json()).data;
            for (const key in videoDetails.stats) {
                videoDetails.stats[key] = formatNumber(videoDetails.stats[key]);
            }
        }
    }
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-white">
    <h1 class="text-5xl font-semibold mb-2">Start Downloading</h1>
    <p class="mb-8 text-secondary-text">No ads, no tracking, no nothing. Download now.</p>
    <div class="flex flex-col md:flex-row items-center w-full max-w-2xl mb-6">
        <input
                type="text"
                bind:value={url}
                placeholder="Download from TikTok, Instagram or Twitter"
                class="p-4 rounded-md w-full mb-4 md:mb-0 md:mr-4 bg-secondary outline-none"
                on:keydown={(e) => e.key === 'Enter' && handleDownload()}
        />
    </div>
    <p class="text-sm text-gray-500 mb-8">
        By using our Service you agree to our <a href="/legal/terms" class="underline">Terms of Service</a>
        and <a href="/legal/privacy" class="underline">Privacy Policy</a>.</p>

    {#if isLoading}
        <SkeletonLoader/>
    {/if}

    {#if videoDetails && !isLoading}
        <div class="bg-secondary flex w-full max-w-4xl max-h-[32rem]">
            <div class="w-1/3">
                <img src={videoDetails.video.cover} alt="Cover" class="object-cover h-full w-full">
            </div>
            <div class="w-2/3 flex flex-col items-start ml-4 mt-3">
                <p class="text-3xl font-semibold">{videoDetails.author.username}</p>
                <p class="mt-2">{videoDetails.video.description.replace(/#\S+/g, '').trim()}</p>

                <div class="mt-auto flex flex-col items-start space-y-2 mb-4">
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/view.svg" alt="Views" class="h-6 w-6 mr-2"
                             style="fill: white">
                        <span>{videoDetails.stats.plays}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/like.svg" alt="Likes" class="h-6 w-6 mr-2">
                        <span>{videoDetails.stats.likes}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/comment.svg" alt="Comments" class="h-6 w-6 mr-2">
                        <span>{videoDetails.stats.comments}</span>
                    </div>
                    <div class="flex items-center">
                        <img src="{config.cdnUrl}/share.svg" alt="Shares" class="h-6 w-6 mr-2">
                        <span>{videoDetails.stats.shares}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start ml-4 mt-3 mr-6">
                <p class="text-3xl font-semibold mb-3">Downloads</p>
                <ScraperDownloadButton {videoDetails} key="withoutWatermark" text="No Watermark"/>
                <ScraperDownloadButton {videoDetails} key="withWatermark" text="Watermark"/>
                <ScraperDownloadButton {videoDetails} key="cover" text="Only Sound"/>
            </div>
        </div>
    {/if}
</div>