<script lang="ts">
    import config from '$config';

    import DownloadIcon from 'lucide-svelte/icons/download';

    export let url: string;
</script>

<a href={url} download={`${config.appName}_${Date.now()}`} target="_blank">
    <button
            class="flex items-center justify-center bg-secondary-button text-black py-2 px-4 rounded-lg w-full whitespace-nowrap"
    >
        <DownloadIcon class="w-5 h-5 mr-1"/>
        Download Current
    </button>
</a>