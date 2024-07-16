<script lang="ts">
  import type { ScraperResult } from '$lib/types';
  import DownloadIcon from 'lucide-svelte/icons/download';
  import FileAudioIcon from 'lucide-svelte/icons/file-audio';
  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

  export let mediaList: ScraperResult['post']['assets'] = [];
  export let getMediaData: (media: typeof currentMedia) => { cover: string, download?: string | null };
  export let soundUrl: string;
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
                    <a class="flex items-center space-x-1" href={currentMediaData.download || currentMediaData.cover} target="_blank" download>
                        <DownloadIcon class="w-5 h-5"/>
                        <span>Download</span>
                    </a>

                    {#if soundUrl}
                        <a class="flex items-center space-x-1" href={soundUrl} target="_blank" download>
                            <FileAudioIcon class="w-5 h-5"/>
                            <span>Sound</span>
                        </a>
                    {/if}
                </div>

                <button class="disabled:opacity-0" disabled={!canNext} on:click={nextMedia}>
                    <ArrowRightIcon class="w-6 h-6"/>
                </button>
            {:else}
                {#if soundUrl}
                    <div class="flex items-center justify-center font-medium space-x-6">
                        <a class="flex items-center space-x-1" href={currentMediaData.download || currentMediaData.cover} target="_blank" download>
                            <DownloadIcon class="w-5 h-5"/>
                            <span>Download</span>
                        </a>
                        <a class="flex items-center space-x-1" href={soundUrl} target="_blank" download>
                            <FileAudioIcon class="w-5 h-5"/>
                            <span>Sound</span>
                        </a>
                    </div>
                {:else}
                    <a class="flex items-center justify-center space-x-1 w-full" href={currentMediaData.download || currentMediaData.cover} target="_blank"
                       download>
                        <DownloadIcon class="w-5 h-5"/>
                        <span>Download</span>
                    </a>
                {/if}
            {/if}
        </div>
    </div>
</div>