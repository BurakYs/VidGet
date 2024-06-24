<script lang="ts">
    import DownloadIcon from 'lucide-svelte/icons/download';

    export let url: string;
    export let text: string = 'Download';
</script>

<a href={url} download={`VidGet ${Date.now()}`}>
    <button
            class="flex items-center justify-center bg-secondary-button text-black py-2 px-4 rounded-lg w-full whitespace-nowrap disabled:opacity-50"
            disabled={!url}
    >
        <DownloadIcon class="w-5 h-5 mr-1"/>
        {text}
    </button>
</a>