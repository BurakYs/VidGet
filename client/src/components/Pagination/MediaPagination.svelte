<script lang="ts">
  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

  export let mediaList: any[] = [];

  let currentMediaIndex = 0;
  export let currentMedia = mediaList[currentMediaIndex];

  $: currentMedia = mediaList[currentMediaIndex];
  $: canPrev = currentMediaIndex > 0;
  $: canNext = currentMediaIndex < mediaList.length - 1;

  function prevMedia() {
    if (canPrev) {
      currentMediaIndex -= 1;
    }
  }

  function nextMedia() {
    if (canNext) {
      currentMediaIndex += 1;
    }
  }

  export let getMediaUrl: (media: any) => string;
  export let className: string;
</script>

<div class="relative w-full flex items-center justify-center">
    <img alt="Media" class={className} src={getMediaUrl(currentMedia)}/>

    {#if canPrev}
        <div class="absolute top-1/2 left-0 transform -translate-y-1/2">
            <button
                    class="p-2 bg-gray-800 bg-opacity-50 rounded-full pointer-events-auto"
                    on:click={prevMedia}
                    on:keydown={(e) => e.key === 'ArrowLeft' && prevMedia()}
            >
                <ArrowLeftIcon class="text-white"/>
            </button>
        </div>
    {/if}
    {#if canNext}
        <div class="absolute top-1/2 right-0 transform -translate-y-1/2">
            <button
                    class="p-2 bg-gray-800 bg-opacity-50 rounded-full pointer-events-auto"
                    on:click={nextMedia}
                    on:keydown={(e) => e.key === 'ArrowRight' && nextMedia()}
            >
                <ArrowRightIcon class="text-white"/>
            </button>
        </div>
    {/if}
</div>