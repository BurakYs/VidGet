<svelte:head>
    <title>{config.appName}</title>
</svelte:head>

<script lang="ts">
  import { writable } from 'svelte/store';
  import handleDownload from '$lib/handleDownload';
  import config from '$config';

  import { Button } from '$components/ui/button';
  import { Input } from '$components/ui/input';

  import SearchIcon from 'lucide-svelte/icons/search';
  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
  import DownloadIcon from 'lucide-svelte/icons/download';

  import ScraperResult from '$components/Scraper/Result.svelte';
  import Settings from '$components/Settings.svelte';

  export const scraperName = writable('');
  export const url = writable('');
  export const isLoading = writable(false);

  async function download() {
    await handleDownload(url, scraperName, isLoading);
  }
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center">
    <h1 class="text-[calc(3rem-6px)] leading-none sm:text-5xl mb-1 font-semibold">Start Downloading</h1>
    <p class="mb-3 text-muted-foreground">No ads, no BS. Download your favorite media.</p>

    <div class="flex flex-col md:flex-row items-center w-full max-w-2xl mb-4 space-y-4 md:space-y-0">
        <div class="relative w-full md:mr-4 h-full">
            <SearchIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground"/>
            <Input
                    type="text"
                    bind:value={$url}
                    on:keydown={(e) => e.key === 'Enter' && download()}
                    placeholder="Download TikToks, Reels or Tweets"
                    class="p-4 pl-12 rounded-lg w-full h-full focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-full/90 bg-background hover:bg-background text-primary">
                <Settings/>
            </Button>
        </div>

        <Button
                class="py-6 px-5 rounded-lg flex items-center justify-center space-x-2 transition-opacity duration-500 w-full md:w-auto disabled:opacity-30 text-base"
                on:click={download}
                disabled={$isLoading || !$url?.trim() || !URL.canParse($url)}
        >
            {#if $isLoading}
                <LoaderCircleIcon class="w-5 h-5 animate-spin"/>
            {:else}
                <DownloadIcon class="w-5 h-5"/>
            {/if}
            <span>Download</span>
        </Button>
    </div>

    <p class="text-sm text-muted-foreground">
        By using our Service you agree to our
        <a class="underline" href="/legal/terms">Terms of Service</a>
        and
        <a class="underline" href="/legal/privacy">Privacy Policy</a>
    </p>

    <ScraperResult/>
</div>
