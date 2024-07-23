<script lang="ts">
  import type { ScraperAsset } from '$lib/types';

  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
  import DownloadIcon from 'lucide-svelte/icons/download';
  import FileAudioIcon from 'lucide-svelte/icons/file-audio';

  import DownloadButton from '$components/Scraper/DownloadButton.svelte';
  import { writable } from 'svelte/store';

  export let mediaList: ScraperAsset[] = [];
  export let soundUrl: string | null;

  let makePagination = mediaList.length > 1;
  let isLoading = writable(false);
  let currentMediaIndex = 0;
  export let currentMedia = mediaList[currentMediaIndex];

  $: currentMedia = mediaList[currentMediaIndex];
  $: currentMediaData = getMediaData(currentMedia);
  $: canPrev = currentMediaIndex > 0 && !$isLoading;
  $: canNext = currentMediaIndex < mediaList.length - 1 && !$isLoading;

  function getMediaData(media: ScraperAsset) {
    return {
      cover: media.cover,
      download: media.download
    };
  }

  function prevMedia() {
    if (canPrev) {
      currentMediaIndex -= 1;
      isLoading.set(true);
    }
  }

  function nextMedia() {
    if (canNext) {
      currentMediaIndex += 1;
      isLoading.set(true);
    }
  }

  function handleMediaLoad(index?: number) {
    isLoading.set(false);

    if (index != null) currentMediaIndex += 1;
  }

  let assetsDownloading = writable(mediaList.map(x => ({ url: x.download || x.cover, isDownloading: false })));
  let audiosDownloading = writable([{ url: soundUrl!, isDownloading: false }]);
</script>

<div class="relative w-full flex items-center justify-center">
    <img alt="Media" class="!w-96 !h-96 object-fill" on:error={() => handleMediaLoad(-1)}
         on:load={() => handleMediaLoad()}
         src={currentMediaData.cover}/>

    <div class="absolute bottom-4 w-[calc(100%-1rem)] h-10 bg-white rounded-lg text-black border-black border">
        <div class="flex items-center {makePagination ? 'justify-between' : 'justify-center'} m-2">
            {#if makePagination}
                <button class="disabled:opacity-50" disabled={!canPrev} on:click={prevMedia}>
                    <ArrowLeftIcon class="w-6 h-6"/>
                </button>
            {/if}

            {#if soundUrl}
                <div class="flex items-center justify-center font-medium space-x-6">
                    <DownloadButton downloadUrl={currentMediaData.download} defaultIcon={DownloadIcon} fileStore={assetsDownloading} text="Download"
                                    disabled={$isLoading}/>
                    <DownloadButton downloadUrl={soundUrl} defaultIcon={FileAudioIcon} fileStore={audiosDownloading} text="Sound" disabled={$isLoading}/>
                </div>
            {:else}
                <DownloadButton downloadUrl={currentMediaData.download} defaultIcon={DownloadIcon} fileStore={assetsDownloading} text="Download"
                                disabled={$isLoading} className="{!makePagination && 'w-full'} justify-center"/>
            {/if}

            {#if makePagination}
                <button class="disabled:opacity-50" disabled={!canNext} on:click={nextMedia}>
                    <ArrowRightIcon class="w-6 h-6"/>
                </button>
            {/if}
        </div>
    </div>
</div>