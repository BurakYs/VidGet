<svelte:head>
    <title>{config.appName}</title>
</svelte:head>

<script lang="ts">
    import type { ComponentType } from 'svelte';
    import { writable } from 'svelte/store';
    import { handleDownload } from '$lib/handleDownload';
    import * as m from '$lib/paraglide/messages.js';
    import config from '$config';

    import SearchIcon from 'lucide-svelte/icons/search';
    import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
    import DownloadIcon from 'lucide-svelte/icons/download';

    import TiktokDetails from '$components/Scrapers/TikTok/BaseDetails.svelte';
    import XDetails from '$components/Scrapers/X/Details.svelte';

    const detailsComponents: Record<string, ComponentType> = {
        TikTok: TiktokDetails,
        X: XDetails
    };

    export const scraperName = writable('');
    export const url = writable('');
    export const details = writable({});
    export const isLoading = writable(false);

    async function download() {
        await handleDownload(url, scraperName, details, isLoading);
    }
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-primary-text">
    <h1 class="text-[calc(3rem-6px)] leading-none sm:text-5xl mb-1 font-semibold">{m.start_downloading()}</h1>
    <p class="mb-3 text-secondary-text">{m.start_downloading_description()}</p>
    <div class="flex flex-col md:flex-row items-center w-full max-w-2xl mb-4 space-y-4 md:space-y-0">
        <div class="relative w-full md:mr-4">
            <SearchIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"/>
            <input
                    type="text"
                    bind:value={$url}
                    on:keydown={(e) => e.key === 'Enter' && download()}
                    placeholder={m.start_downloading_input_placeholder()}
                    class="appearance-none border-0 p-4 pl-12 rounded-lg w-full bg-secondary outline-none placeholder-secondary-text focus:ring-0"
            />
        </div>
        <button
                class="bg-secondary text-primary-text p-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-opacity duration-500 w-full md:w-auto disabled:opacity-50"
                on:click={download}
                disabled={$isLoading || !$url?.trim()}
        >
            {#if $isLoading}
                <LoaderCircleIcon class="w-5 h-5 animate-spin"/>
            {:else}
                <DownloadIcon class="w-5 h-5"/>
            {/if}
            <span>{m.start_downloading_button()}</span>
        </button>
    </div>

    <p class="text-sm text-gray-500">{@html m.start_downloading_disclaimer()}</p>

    {#if $details && !$isLoading}
        <svelte:component this={detailsComponents[$scraperName]} details={$details}/>
    {/if}
</div>