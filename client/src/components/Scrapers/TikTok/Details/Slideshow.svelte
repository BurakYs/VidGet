<script lang="ts">
  export let details: Record<string, any>;

  import MediaPagination from '$components/Pagination/MediaPagination.svelte';
  import Modal from '$components/Modal.svelte';
  import DownloadButton from '$components/Scrapers/DownloadButton.svelte';

  const images = details.slideshow.images;
  let currentMedia: string;
</script>

<Modal>
    <MediaPagination className="w-52 h-64 sm:h-[20rem]" getMediaUrl={(media) => media} mediaList={images}/>

    <div class="relative flex flex-col p-3 sm:p-4 sm:bg-secondary">
        <div class="max-w-72">
            <h2 class="text-left text-2xl font-semibold">{details.author.username}</h2>
            <p class="mt-1 text-left text-sm text-gray-400">{details.post.description?.slice(0, 128)}</p>
        </div>
        <div class="flex flex-col mt-3 sm:mt-auto">
            <div class="w-full mt-5 flex flex-col gap-y-3">
                <DownloadButton text="Download This" url={currentMedia}/>
                <DownloadButton text="Only Sound" url={details.music.playUrl}/>
            </div>
        </div>
    </div>
</Modal>