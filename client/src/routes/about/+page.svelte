<svelte:head>
    <title>{m.about_title()}</title>
</svelte:head>

<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
</script>

<div class="container mx-auto flex flex-col items-center justify-center flex-grow p-4 text-center text-primary-text">
    <h1 class="text-5xl font-semibold mb-4">{m.about_project()}</h1>
    <p class="mb-8 text-secondary-text">{@html m.about_project_description()}</p>
</div>