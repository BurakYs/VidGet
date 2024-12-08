<script lang="ts">
  import type { Component } from 'svelte';
  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
  import saveFile from '$lib/saveFile';

  let { downloadUrl = null, defaultIcon, fileStore, disabled = false, className = '', text }: {
    downloadUrl: string | null;
    defaultIcon: Component;
    fileStore: Array<{ url: string; isDownloading: boolean }>;
    disabled?: boolean;
    className?: string;
    text: string;
  } = $props();

  let isDownloading = $derived(fileStore.find((x) => x.url === downloadUrl)?.isDownloading);

  let currentComponent = $derived(
    isDownloading
      ? { component: LoaderCircleIcon, className: 'w-5 h-5 animate-spin' }
      : { component: defaultIcon, className: 'w-5 h-5' }
  );
</script>

<button
  class="flex items-center space-x-1 disabled:opacity-50 {className}"
  disabled={!downloadUrl || isDownloading || disabled}
  onclick={() => downloadUrl && saveFile(downloadUrl, undefined, fileStore)}>
  <currentComponent.component class={`${currentComponent.className}`}/>
  <span>{text}</span>
</button>
