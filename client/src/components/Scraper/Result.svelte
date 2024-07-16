<script lang="ts">
  import Modal from '$components/Modal.svelte';
  import MediaPagination from '$components/Pagination/MediaPagination.svelte';
  import type { ScraperResult } from '$lib/types';

  import XIcon from 'lucide-svelte/icons/x';

  export let details: ScraperResult;

  const assets = details.post.assets;
  let isModalOpen: boolean;
</script>

<Modal bind:isModalOpen>
    <div class="relative flex flex-col sm:bg-secondary max-w-96">
        <div class="flex items-center mb-3 px-3 pt-3">
            <img alt={details.author.nickname} class="w-10 h-10 rounded-full mr-3" src={details.author.avatar}/>
            {#if details.author.nickname}
                <div>
                    <p class="text-left text-xl font-semibold">{details.author.nickname.slice(0, 16)}</p>
                    <p class="text-left text-sm text-gray-400">@{details.author.username}</p>
                </div>
            {:else }
                <p class="text-left text-lg">{details.author.username}</p>
            {/if}

            <button class="ml-auto" on:click={() => isModalOpen = false}>
                <XIcon class="w-6 h-6 text-gray-400"/>
            </button>
        </div>

        <div class="flex items-center justify-center">
            <MediaPagination
                    mediaList={assets}
                    soundUrl={details.audio?.download}
            />
        </div>
    </div>
</Modal>