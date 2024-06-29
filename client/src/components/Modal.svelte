<script lang="ts">
    import '$lib/styles/fade.css';

    let isModalOpen = true;
</script>

{#if isModalOpen}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out cursor-default"
         on:click={() => isModalOpen = false}
         on:keydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
         aria-label="Close Modal"
         role="button"
         tabindex="0"
    >
        <div class="relative flex flex-col sm:flex-row bg-secondary text-primary-text rounded-lg shadow-lg animate-fade-in max-w-xs sm:max-w-2xl sm:w-auto pointer-events-none"
             on:click|stopPropagation
             on:keydown={(e) => e.key === 'Escape' && (isModalOpen = false)}
             aria-label="Modal"
             role="button"
             tabindex="0"
        >
            <slot></slot>
        </div>
    </div>
{/if}