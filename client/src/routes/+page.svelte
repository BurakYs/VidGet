<svelte:head>
    <title>VidGet</title>
</svelte:head>

<script lang="ts">
    import { handleDownload } from '$lib/handleDownload';
    import config from '$config';

    import TiktokDetails from '$components/Scraper/TikTok/Details.svelte';

    const detailsComponents: Record<string, any> = {
        TikTok: TiktokDetails
    };

    let scraperName = '';
    let url = '';
    let details: Record<string, any>;
    let isLoading = false;

    async function download() {
        await handleDownload(
            url,
            (newScraperName) => scraperName = newScraperName,
            (newUrl) => url = newUrl,
            (newDetails) => details = newDetails,
            (loading) => isLoading = loading
        );
    }
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-white">
    <h1 class="text-5xl font-semibold mb-2">Start Downloading</h1>
    <p class="mb-8 text-secondary-text">No ads, no tracking, no nothing. Download now.</p>
    <div class="flex flex-col md:flex-row items-center w-full max-w-2xl mb-6 space-y-4 md:space-y-0">
        <div class="relative w-full md:mr-4">
            <img
                    src="{config.cdnUrl}/search.svg"
                    alt="Search icon"
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
            <input
                    type="text"
                    bind:value={url}
                    on:keydown={(e) => e.key === 'Enter' && download()}
                    placeholder="Download from TikTok, Instagram or Twitter"
                    class="p-4 pl-12 rounded-md w-full bg-secondary outline-none"
            />
        </div>
        <button
                class="bg-secondary text-white p-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-opacity duration-500"
                on:click={download}
                disabled={isLoading}
                class:opacity-50={isLoading}
        >
            <img
                    src={isLoading ? `${config.cdnUrl}/loading.svg` : `${config.cdnUrl}/download.svg`}
                    alt="Download icon"
                    class="w-6 h-6"
            />
            <span>Download</span>
        </button>
    </div>

    <p class="text-sm text-gray-500 mb-8">
        By using our Service you agree to our <a href="/legal/terms" class="underline">Terms of Service</a>
        and <a href="/legal/privacy" class="underline">Privacy Policy</a>.</p>

    {#if details && !isLoading}
        <svelte:component this={detailsComponents[scraperName]} details={details}/>
    {/if}
</div>