<svelte:head>
    <title>{m.error_title()}</title>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { languageTag } from '$lib/paraglide/runtime.js';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import * as m from '$lib/paraglide/messages.js';

  const errors: Record<string, string> = {
    '4': m.error_page_not_found(),
    '5': m.error_server_error()
  };

  const error = errors[$page.status.toString()[0]];

  onMount(() => {
    setTimeout(() => {
      goto(`/${languageTag()}`);
    }, 5000);
  });
</script>

<div class="flex flex-col items-center justify-center flex-grow p-4 text-center text-primary-text">
    <h1 class="text-5xl font-semibold mb-2">{m.error_status_code({ statusCode: $page.status })}</h1>
    <p class="mb-2 text-lg text-secondary-text">{error}</p>
    <p class="mb-8 text-lg text-secondary-text">{m.error_redirect_home()}</p>
</div>