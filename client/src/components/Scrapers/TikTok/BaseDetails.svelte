<script lang="ts">
    import Video from '$components/Scrapers/TikTok/Details/Video.svelte';
    import Slideshow from '$components/Scrapers/TikTok/Details/Slideshow.svelte';

    export let details: Record<string, any>;
</script>

{#if details.type === 'video'}
    <Video {details}/>
{:else if details.type === 'slideshow'}
    <Slideshow {details}/>
{/if}