<script lang="ts">
  import MediaPagination from '$components/Pagination/MediaPagination.svelte';
  import Modal from '$components/Modal.svelte';
  import DownloadButton from '$components/Scrapers/DownloadButton.svelte';

  export let details: Record<string, any>;
  let currentMedia: Record<string, any> = {};
</script>

<Modal>
    <MediaPagination bind:currentMedia className="w-full max-h-80 sm:h-full object-contain" getMediaUrl={(media) => media.poster || media.url}
                     mediaList={details.post.media}/>

    <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
        <div class="max-w-72">
            <h2 class="text-left text-2xl font-semibold">{details.author.username}</h2>
            <p class="mt-1 text-left text-sm text-gray-400">{details.post.text?.slice(0, 256)}</p>
        </div>
        <div class="flex flex-col sm:mt-auto">
            <div class="w-full mt-5">
                <DownloadButton text="Download Current" url={currentMedia.url}/>
            </div>
        </div>
    </div>
</Modal>