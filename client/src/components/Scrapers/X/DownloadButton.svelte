<script lang="ts">
    import DownloadIcon from 'lucide-svelte/icons/download';
    import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';

    export let url: string;
    console.log(url);
    let isLoading = false;

    async function fetchAndDownloadUrl() {
        isLoading = true;
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = '';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        isLoading = false;
    }
</script>

<button
        class="flex items-center justify-center bg-secondary-button text-black py-2 px-4 rounded-lg w-full whitespace-nowrap disabled:opacity-50"
        on:click={fetchAndDownloadUrl}
        disabled={isLoading}
>
    {#if isLoading}
        <LoaderCircleIcon class="w-5 h-5 mr-1 animate-spin"/>
    {:else}
        <DownloadIcon class="w-5 h-5 mr-1"/>
    {/if}
    Download Current
</button>