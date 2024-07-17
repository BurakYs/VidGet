<script lang="ts">
  import { writable } from 'svelte/store';

  export let isModalOpen = writable(true);

  function closeModal() {
    isModalOpen.set(false);
  }
</script>

{#if $isModalOpen}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out cursor-default"
         on:click={closeModal}
         on:keydown={(e) => e.key === 'Escape' && closeModal()}
         aria-label="Close Modal"
         role="button"
         tabindex="0"
    >
        <div
                class="relative flex flex-col sm:flex-row bg-secondary text-primary-text rounded-lg animate-fade-in cursor-default"
                on:click|stopPropagation
                on:keydown={(e) => e.key === 'Escape' && closeModal()}
                aria-label="Modal"
                role="button"
                tabindex="0"
        >
            <slot class="pointer-events-none"/>
        </div>
    </div>
{/if}