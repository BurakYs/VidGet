<script lang="ts">
  import type { Writable } from 'svelte/store';
  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
  import FileAudioIcon from 'lucide-svelte/icons/file-audio';
  import saveFile from '$lib/saveFile';

  export let downloadUrl: string;
  export let fileStore: Writable<Array<{ url: string, isDownloading: boolean }>>;
  export let text: string;
  $: isDownloading = $fileStore.find(x => x.url === downloadUrl)?.isDownloading;

  $: currentComponent = isDownloading
    ? { component: LoaderCircleIcon, className: 'w-5 h-5 animate-spin' }
    : { component: FileAudioIcon, className: 'w-5 h-5' };
</script>

<button
        class="flex items-center space-x-1 disabled:opacity-50"
        disabled={isDownloading}
        on:click={() => saveFile(downloadUrl, undefined, fileStore)}>
    <svelte:component class={currentComponent.className} this={currentComponent.component}/>
    <span>{text}</span>
</button>