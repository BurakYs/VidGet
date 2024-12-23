<script lang="ts">
  import type { ScraperAsset } from '$lib/types';

  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
  import DownloadIcon from 'lucide-svelte/icons/download';
  import FileAudioIcon from 'lucide-svelte/icons/file-audio';

  import DownloadButton from '$components/Scraper/DownloadButton.svelte';

  let { mediaList = [], soundUrl = null }: {
    mediaList: ScraperAsset[];
    soundUrl: string | null;
  } = $props();

  let currentMediaIndex = $state(0);
  let isLoading = $state(false);
  let assetsDownloading = $state(mediaList.map((x) => ({ url: x.download || x.cover, isDownloading: false })));
  let audiosDownloading = $state([{ url: soundUrl!, isDownloading: false }]);

  let shouldMakePagination = mediaList.length > 1;
  let currentMedia = $derived(mediaList[currentMediaIndex]);
  let currentMediaData = $derived(getMediaData(currentMedia));

  let canPrev = $derived(currentMediaIndex > 0 && !isLoading);
  let canNext = $derived(currentMediaIndex < mediaList.length - 1 && !isLoading);

  function getMediaData(media: ScraperAsset) {
    return {
      cover: media.cover,
      download: media.download
    };
  }

  function prevMedia() {
    if (canPrev) {
      currentMediaIndex -= 1;
      isLoading = true;
    }
  }

  function nextMedia() {
    if (canNext) {
      currentMediaIndex += 1;
      isLoading = true;
    }
  }

  function handleMediaLoad() {
    isLoading = false;
  }
</script>

<div class="relative w-full flex items-center justify-center">
  <img
    alt="Media"
    class="!w-96 !h-96 object-fill"
    onload={() => handleMediaLoad()}
    onerror={() => handleMediaLoad()}
    src={currentMediaData.cover}
  />

  <div
    class="absolute bottom-4 w-[calc(100%-1rem)] h-10 bg-white rounded-lg text-black border-black border"
  >
    <div class="flex items-center {shouldMakePagination ? 'justify-between': 'justify-center'} m-2">
      {#if shouldMakePagination}
        <button
          class="disabled:opacity-50"
          disabled={!canPrev}
          onclick={prevMedia}
        >
          <ArrowLeftIcon class="w-6 h-6"/>
        </button>
      {/if}

      <div class="flex items-center justify-center font-medium space-x-6">
        <DownloadButton
          downloadUrl={currentMediaData.download}
          defaultIcon={DownloadIcon}
          fileStore={assetsDownloading}
          text="Download"
          disabled={isLoading}
          className="{!shouldMakePagination && 'w-full'} justify-center"
        />
        {#if soundUrl}
          <DownloadButton
            downloadUrl={soundUrl}
            defaultIcon={FileAudioIcon}
            fileStore={audiosDownloading}
            text="Sound"
            disabled={isLoading}
          />
        {/if}
      </div>

      {#if shouldMakePagination}
        <button
          class="disabled:opacity-50"
          disabled={!canNext}
          onclick={nextMedia}
        >
          <ArrowRightIcon class="w-6 h-6"/>
        </button>
      {/if}
    </div>
  </div>
</div>
