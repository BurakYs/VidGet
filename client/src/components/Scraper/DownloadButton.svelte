<script lang="ts">
    export let videoDetails: Record<string, any>;
    export let platform: string;
    export let text: string;
</script>

<a href={videoDetails.video[platform]} target="_blank">
    <button
            class="bg-primary-button text-white flex items-center justify-center py-3 px-6 rounded-xl mt-2 w-40 h-10 mb-2 disabled:opacity-50"
            disabled={!videoDetails.video[platform]}
    >
        {text}
    </button>
</a>