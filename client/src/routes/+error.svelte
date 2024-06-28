<svelte:head>
    <title>Error</title>
</svelte:head>

<script lang="ts">
    import { page } from '$app/stores';

    const errors: Record<string, string> = {
        '4': 'Page not found',
        '5': 'An error occurred on our side'
    };

    const error = errors[$page.status.toString()[0]];
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-primary-text">
    <h1 class="text-5xl font-semibold mb-2">Error {$page.status}</h1>
    <p class="mb-8 text-lg text-secondary-text">{error}</p>
    <img src="https://cdn.buraky.live/cat.png" alt="cat">
</div>