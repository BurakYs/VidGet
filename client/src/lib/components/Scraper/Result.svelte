<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import MediaPagination from '$components/Pagination/MediaPagination.svelte';
  import detailsStore from '$lib/stores/details';
</script>

<Dialog.Root open={!!$detailsStore} onOpenChange={() => detailsStore.set(null)}>
  <Dialog.Content class="p-0 max-w-96">
    {#if $detailsStore}
      <Dialog.Header class="text-start px-3 pt-3">
        <div class="flex items-center">
          <img
            alt={$detailsStore.author?.nickname || $detailsStore.author?.username || 'Unknown User'}
            class="w-10 h-10 rounded-full mr-3"
            src={$detailsStore.author?.profilePicture || '/default-pfp.png'}
          />
          {#if $detailsStore.author?.nickname && $detailsStore.author?.username}
            <div>
              <p class="text-left text-xl font-semibold">
                {$detailsStore.author.nickname.slice(0, 24)}
              </p>
              <p class="text-left text-sm text-muted-foreground">
                @{$detailsStore.author.username}
              </p>
            </div>
          {:else}
            <p class="text-left text-lg">{$detailsStore.author?.username || 'Unknown User'}</p>
          {/if}
        </div>
      </Dialog.Header>
      <div class="flex items-center justify-center">
        <MediaPagination
          mediaList={$detailsStore.post.assets}
          soundUrl={$detailsStore.audio?.download || null}
        />
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>