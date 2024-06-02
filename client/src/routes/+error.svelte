<script lang="ts">
    import { page } from '$app/stores';

    const errors: Record<string, string> = {
        '4': 'Page not found',
        '5': 'An error occurred on our side'
    };

    const error = errors[$page.status.toString()[0]];
</script>

<svelte:head>
    <title>Error</title>
</svelte:head>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-white">
    <h1 class="text-6xl font-semibold mb-2">{$page.status}</h1>
    <p class="mb-8 text-lg text-secondary-text">{error}</p>
</div>