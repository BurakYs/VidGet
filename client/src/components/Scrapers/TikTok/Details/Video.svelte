<script lang="ts">
    export let details: Record<string, any>;

    import Modal from '$components/Modal.svelte';
    import TiktokDownloadButton from '$components/Scrapers/TikTok/DownloadButton.svelte';
</script>

<Modal>
    <div class="relative hidden sm:block sm:w-48">
        <img src="{details.video.cover}" alt="Cover" class="w-full h-full rounded-lg sm:rounded-r-none"/>
    </div>

    <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
        <div class="max-w-72">
            <h2 class="text-left text-2xl font-semibold wrap">{details.author.username}</h2>
            <p class="mt-1 text-left text-sm text-gray-400 wrap">{details.post.description?.slice(0, 128)}</p>
        </div>
        <div class="flex flex-col mt-3 sm:mt-auto">
            <div class="w-full mt-5 flex flex-col gap-y-3">
                <TiktokDownloadButton url={details.video.withoutWatermark} text="No Watermark"/>
                <TiktokDownloadButton url={details.music.playUrl} text="Only Sound"/>
            </div>
        </div>
    </div>
</Modal>