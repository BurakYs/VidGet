<script lang="ts">
    import formatNumber from '$lib/formatNumber';
    import TiktokDownloadButton from '$components/Scrapers/TikTok/DownloadButton.svelte';

    import PlayIcon from 'lucide-svelte/icons/play';
    import HeartIcon from 'lucide-svelte/icons/heart';
    import CommentIcon from 'lucide-svelte/icons/message-circle';
    import ShareIcon from 'lucide-svelte/icons/share';

    export let details: Record<string, any>;
    let isModalOpen = true;

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

{#if isModalOpen}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out pointer-events-none"
         on:click={() => isModalOpen = false}
         on:keydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
         aria-label="Close Modal"
         role="button"
         tabindex="0"
    >
        <div class="relative flex flex-col sm:flex-row bg-secondary text-white rounded-lg shadow-lg animate-fade-in max-w-xs sm:max-w-2xl sm:w-auto h-auto pointer-events-auto"
             on:click|stopPropagation
             on:keydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
             aria-label="Modal"
             role="button"
             tabindex="0"
        >
            <div class="absolute inset-0 bg-cover bg-center rounded-lg sm:hidden"
                 style="background-image: url('{details.video.cover}');"></div>
            <div class="absolute inset-0 bg-black bg-opacity-70 rounded-lg sm:hidden"></div>

            <div class="relative hidden sm:block sm:w-48">
                <img src="{details.video.cover}" alt="Cover" class="w-full h-full rounded-lg sm:rounded-r-none"/>
            </div>

            <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
                <div class="max-w-72">
                    <h2 class="text-left text-2xl font-semibold wrap">{details.author.username}</h2>
                    <p class="mt-1 text-left text-sm text-gray-400 wrap">{details.video.description?.slice(0, 128)}</p>
                </div>
                <div class="mt-6 sm:mt-auto">
                    <div class="flex items-center justify-between">
                        {#each stats as stat}
                            <div class="flex items-center space-x-1">
                                <svelte:component this={stat.icon} class="w-5 h-5"/>
                                <p>{stat.count}</p>
                            </div>
                        {/each}
                    </div>

                    <div class="w-fit sm:w-full">
                        <div class="mt-4 flex justify-between space-x-1">
                            <TiktokDownloadButton {details} key="video.withoutWatermark" text="No Watermark"/>
                            <TiktokDownloadButton {details} key="video.withWatermark" text="Watermark"/>
                        </div>

                        <div class="mt-2 wrap">
                            <TiktokDownloadButton {details} key="music.playUrl" text="Only Sound"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- TODO: Svelte's Fade transition didn't work -->
<style>
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes fade-out {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }

    .animate-fade-in {
        animation: fade-in 0.3s ease-in-out;
    }

    .wrap {
        overflow-wrap: anywhere;
        word-wrap: anywhere;
        white-space: pre-wrap;
    }
</style>