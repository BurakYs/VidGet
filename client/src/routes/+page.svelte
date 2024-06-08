<svelte:head>
    <title>VidGet</title>
</svelte:head>

<script lang="ts">
    import { handleDownload } from '$lib/handleDownload';

    import SearchIcon from 'lucide-svelte/icons/search';
    import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
    import DownloadIcon from 'lucide-svelte/icons/download';

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
            <SearchIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"/>
            <input
                    type="text"
                    bind:value={url}
                    on:keydown={(e) => e.key === 'Enter' && download()}
                    placeholder="Download TikToks, Reels or Tweets"
                    class="p-4 pl-12 rounded-md w-full bg-secondary outline-none"
            />
        </div>
        <button
                class="bg-secondary text-white p-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-opacity duration-500 w-full md:w-auto"
                on:click={download}
                disabled={isLoading}
                class:opacity-50={isLoading}
        >
            {#if isLoading}
                <LoaderCircleIcon class="w-5 h-5 animate-spin"/>
            {:else}
                <DownloadIcon class="w-5 h-5"/>
            {/if}
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