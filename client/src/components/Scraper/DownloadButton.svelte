<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { ComponentType } from 'svelte';
  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
  import saveFile from '$lib/saveFile';

  export let downloadUrl: string | null;
  export let defaultIcon: ComponentType;
  export let fileStore: Writable<Array<{ url: string, isDownloading: boolean }>>;
  export let disabled: boolean = false;
  export let text: string;
  $: isDownloading = $fileStore.find(x => x.url === downloadUrl)?.isDownloading;

  $: currentComponent = isDownloading
    ? { component: LoaderCircleIcon, className: 'w-5 h-5 animate-spin' }
    : { component: defaultIcon, className: 'w-5 h-5' };
</script>

<button
        class="flex items-center space-x-1 disabled:opacity-50"
        disabled={!downloadUrl || isDownloading || disabled}
        on:click={() => downloadUrl && saveFile(downloadUrl, undefined, fileStore)}>
    <svelte:component class={currentComponent.className} this={currentComponent.component}/>
    <span>{text}</span>
</button>