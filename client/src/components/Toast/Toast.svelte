<script lang="ts">
    import { fade } from 'svelte/transition';

    export let message: string = '';
    export let type: 'success' | 'error' | 'info' = 'info';
</script>

<div class={`bg-[#292933] fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-md px-4 py-3 text-primary-text shadow-lg animate-fade-in min-w-64`}
     transition:fade={{ duration: 500 }}>
    <div class="rounded-md p-2">
        {#if type === 'success'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
            </svg>
        {:else if type === 'error'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6l-12 12M6 6l12 12"/>
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
        {/if}
    </div>
    <div class="flex flex-col">
        <p class="text-sm text-gray-400">{message}</p>
    </div>
</div>