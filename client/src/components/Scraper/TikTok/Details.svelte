<script lang="ts">
    import TiktokDownloadButton from '$components/Scraper/TikTok/DownloadButton.svelte';

    import PlayIcon from 'lucide-svelte/icons/play';
    import HeartIcon from 'lucide-svelte/icons/heart';
    import CommentIcon from 'lucide-svelte/icons/message-circle';
    import ShareIcon from 'lucide-svelte/icons/share';

    export let details: Record<string, any>;
</script>

<div class="bg-secondary flex w-full max-w-4xl max-h-[32rem]">
    <div class="w-1/3">
        <img src={details.video.cover} alt="Cover" class="object-cover h-full w-full">
    </div>
    <div class="w-2/3 flex flex-col items-start ml-4 mt-3">
        <p class="text-3xl font-semibold">{details.author.username}</p>
        <p class="mt-2">{details.video.description.replace(/#\S+/g, '').trim()}</p>

        <div class="mt-auto flex flex-col items-start space-y-2 mb-4">
            <div class="flex items-center">
                <PlayIcon class="h-6 w-6 mr-2"/>
                <span>{details.stats.plays}</span>
            </div>
            <div class="flex items-center">
                <HeartIcon class="h-6 w-6 mr-2"/>
                <span>{details.stats.likes}</span>
            </div>
            <div class="flex items-center">
                <CommentIcon class="h-6 w-6 mr-2"/>
                <span>{details.stats.comments}</span>
            </div>
            <div class="flex items-center">
                <ShareIcon class="h-6 w-6 mr-2"/>
                <span>{details.stats.shares}</span>
            </div>
        </div>
    </div>
    <div class="flex flex-col items-start ml-4 mt-3 mr-6">
        <p class="text-3xl font-semibold mb-3">Downloads</p>
        <TiktokDownloadButton {details} key="video.withoutWatermark" text="No Watermark"/>
        <TiktokDownloadButton {details} key="video.withWatermark" text="Watermark"/>
        <TiktokDownloadButton {details} key="music.playUrl" text="Only Sound"/>
    </div>
</div>