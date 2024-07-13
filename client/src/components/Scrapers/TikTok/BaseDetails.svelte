<script lang="ts">
  import Video from './Details/Video.svelte';
  import Slideshow from './Details/Slideshow.svelte';

  export let details: Record<string, any>;
</script>

{#if details.type === 'video'}
    <Video {details}/>
{:else if details.type === 'slideshow'}
    <Slideshow {details}/>
{/if}