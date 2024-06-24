<script lang="ts">
    export let details: Record<string, any>;

    import formatNumber from '$lib/formatNumber';
    import Modal from '$components/Modal.svelte';
    import TiktokDownloadButton from '$components/Scrapers/TikTok/DownloadButton.svelte';

    import PlayIcon from 'lucide-svelte/icons/play';
    import HeartIcon from 'lucide-svelte/icons/heart';
    import CommentIcon from 'lucide-svelte/icons/message-circle';
    import ShareIcon from 'lucide-svelte/icons/share';
    import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
    import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

    const images = details.slideshow.images;

    let currentMediaIndex = 0;
    $: currentMedia = images[currentMediaIndex];

    $: canPrev = currentMediaIndex > 0;
    $: canNext = currentMediaIndex < images.length - 1;

    function prevMedia() {
        if (currentMediaIndex > 0) currentMediaIndex -= 1;
    }

    function nextMedia() {
        if (currentMediaIndex < images.length - 1) currentMediaIndex += 1;
    }

    let stats = [
        {
            icon: PlayIcon,
            count: formatNumber(details.stats.plays)
        },
        {
            icon: HeartIcon,
            count: formatNumber(details.stats.likes)
        },
        {
            icon: CommentIcon,
            count: formatNumber(details.stats.comments)
        },
        {
            icon: ShareIcon,
            count: formatNumber(details.stats.shares)
        }
    ];
</script>

<Modal>
    <div class="relative w-full sm:max-w-48 flex items-center justify-center">
        <img src={currentMedia} alt="Media"
             class="w-52 h-64 sm:h-[20rem] rounded-t-lg sm:rounded-l-lg sm:rounded-r-none"/>
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
            <p class="mt-1 text-left text-sm text-gray-400">{details.post.description?.slice(0, 128)}</p>
        </div>
        <div class="flex flex-col mt-3 sm:mt-auto">
            <div class="flex items-center justify-between">
                {#each stats as stat}
                    <div class="flex items-center justify-between gap-x-1">
                        <svelte:component this={stat.icon} class="w-5 h-5"/>
                        <p>{stat.count}</p>
                    </div>
                {/each}
            </div>

            <div class="w-full mt-5 flex flex-col gap-y-3">
                <TiktokDownloadButton url={currentMedia} text="Download This"/>
                <TiktokDownloadButton url={details.music.playUrl} text="Only Sound"/>
            </div>
        </div>
    </div>
</Modal>