<svelte:head>
    <title>Error</title>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const redirectMs = 3000;

  const errors: Record<string, string> = {
    '4': 'The page you are looking for does not exist.',
    '5': 'An error occurred on our side. Please try again later.'
  };

  const error = errors[$page.status.toString()[0]];

  onMount(() => {
    setTimeout(() => {
      goto('/');
    }, redirectMs);
  });
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-primary">
    <h1 class="text-5xl font-semibold mb-2">Error {$page.status}</h1>
    <p class="mb-2 text-lg text-muted-foreground">{error}</p>
    <p class="mb-8 text-lg text-muted-foreground">You will be redirected to the home page in {redirectMs / 1000} seconds.</p>
</div>