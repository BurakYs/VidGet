<script lang="ts">
    import formatNumber from '$lib/formatNumber';
    import Modal from '$components/Modal.svelte';
    import TiktokDownloadButton from '$components/Scrapers/TikTok/DownloadButton.svelte';

    import PlayIcon from 'lucide-svelte/icons/play';
    import HeartIcon from 'lucide-svelte/icons/heart';
    import CommentIcon from 'lucide-svelte/icons/message-circle';
    import ShareIcon from 'lucide-svelte/icons/share';

    export let details: Record<string, any>;

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
    <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
        <div class="max-w-72">
            <h2 class="text-left text-2xl font-semibold wrap">{details.author.username}</h2>
            <p class="mt-1 text-left text-sm text-gray-400 wrap">{details.post.description?.slice(0, 128)}</p>
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
                    <TiktokDownloadButton url={details.video.withoutWatermark} text="No Watermark"/>
                    <TiktokDownloadButton url={details.video.withWatermark} text="Watermark"/>
                </div>

                <div class="mt-2 wrap">
                    <TiktokDownloadButton url={details.music.playUrl} text="Only Sound"/>
                </div>
            </div>
        </div>
    </div>
</Modal>