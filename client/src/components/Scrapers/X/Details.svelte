<script lang="ts">
    import Modal from '$components/Modal.svelte';
    import XDownloadButton from '$components/Scrapers/X/DownloadButton.svelte';

    import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
    import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

    export let details: Record<string, any>;

    let currentMediaIndex = 0;
    $: currentMedia = details.post.media[currentMediaIndex];

    $: canPrev = currentMediaIndex > 0;
    $: canNext = currentMediaIndex < details.post.media.length - 1;

    function prevMedia() {
        if (currentMediaIndex > 0) currentMediaIndex -= 1;
    }

    function nextMedia() {
        if (currentMediaIndex < details.post.media.length - 1) currentMediaIndex += 1;
    }
</script>

<!-- TOOD: Needs a proper rework -->
<Modal>
    <div class="relative w-full sm:max-w-48 flex items-center justify-center">
        <img src={currentMedia.poster || currentMedia.url} alt="Media"
             class="w-full max-h-80 sm:h-full rounded-t-lg sm:rounded-l-lg sm:rounded-r-none object-contain"/>

        {#if canPrev}
            <div class="absolute top-1/2 left-0 transform -translate-y-1/2">
                <button on:click={prevMedia} class="p-2 bg-gray-800 bg-opacity-50 rounded-full shadow-2xl">
                    <ArrowLeftIcon class="text-white"/>
                </button>
            </div>
        {/if}
        {#if canNext}
            <div class="absolute top-1/2 right-0 transform -translate-y-1/2">
                <button on:click={nextMedia} class="p-2 bg-gray-800 bg-opacity-50 rounded-full shadow-lg">
                    <ArrowRightIcon class="text-white"/>
                </button>
            </div>
        {/if}
    </div>

    <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
        <div class="max-w-72">
            <h2 class="text-left text-2xl font-semibold">{details.author.username}</h2>
            <p class="mt-1 text-left text-sm text-gray-400">{details.post.text?.slice(0, 256)}</p>
        </div>
        <div class="flex flex-col sm:mt-auto">
            <div class="w-full mt-5">
                <XDownloadButton url={currentMedia.url}/>
            </div>
        </div>
    </div>
</Modal>