<script lang="ts">
  import type { ScraperPostAsset, ScraperResult } from '$lib/types';

  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
  import DownloadIcon from 'lucide-svelte/icons/download';
  import FileAudioIcon from 'lucide-svelte/icons/file-audio';

  import DownloadButton from '$components/Scraper/DownloadButton.svelte';
  import { writable } from 'svelte/store';

  export let mediaList: ScraperResult['post']['assets'] = [];
  export let getMediaData: (media: ScraperPostAsset) => ScraperPostAsset;
  export let soundUrl: string | null | undefined;
  export let makePagination: boolean = true;

  let currentMediaIndex = 0;
  export let currentMedia = mediaList[currentMediaIndex];

  $: currentMedia = mediaList[currentMediaIndex];
  $: currentMediaData = getMediaData(currentMedia);
  $: canPrev = currentMediaIndex > 0;
  $: canNext = currentMediaIndex < mediaList.length - 1;

  function prevMedia() {
    if (canPrev) currentMediaIndex -= 1;
  }

  function nextMedia() {
    if (canNext) currentMediaIndex += 1;
  }

  let assetsDownloading = writable(mediaList.map(x => ({ url: x.download || x.cover, isDownloading: false })));
  let audiosDownloading = writable([{ url: soundUrl, isDownloading: false }]);
</script>

<div class="relative w-full flex items-center justify-center">
    <img alt="Media" class="!w-96 !h-96 object-cover" src={currentMediaData.cover}/>

    <div class="absolute bottom-4 w-[calc(100%-1rem)] h-10 bg-white rounded-lg text-black">
        <div class="flex items-center {makePagination ? 'justify-between' : 'justify-center'} m-2">
            {#if makePagination}
                <button class="disabled:opacity-0" disabled={!canPrev} on:click={prevMedia}>
                    <ArrowLeftIcon class="w-6 h-6"/>
                </button>

                <div class="flex items-center justify-center font-medium space-x-6">
                    <DownloadButton downloadUrl={currentMediaData.download || currentMediaData.cover} defaultIcon={DownloadIcon} fileStore={assetsDownloading}
                                    text="Download"/>

                    {#if soundUrl}
                        <DownloadButton downloadUrl={soundUrl} defaultIcon={FileAudioIcon} fileStore={audiosDownloading} text="Sound"/>
                    {/if}
                </div>

                <button class="disabled:opacity-0" disabled={!canNext} on:click={nextMedia}>
                    <ArrowRightIcon class="w-6 h-6"/>
                </button>
            {:else}
                {#if soundUrl}
                    <div class="flex items-center justify-center font-medium space-x-6">
                        <DownloadButton downloadUrl={currentMediaData.download || currentMediaData.cover} defaultIcon={DownloadIcon}
                                        fileStore={assetsDownloading}
                                        text="Download"/>
                        <DownloadButton downloadUrl={soundUrl} defaultIcon={FileAudioIcon} fileStore={audiosDownloading} text="Sound"/>
                    </div>
                {:else}
                    <DownloadButton downloadUrl={currentMediaData.download || currentMediaData.cover} defaultIcon={DownloadIcon} fileStore={assetsDownloading}
                                    text="Download"/>
                {/if}
            {/if}
        </div>
    </div>
</div>