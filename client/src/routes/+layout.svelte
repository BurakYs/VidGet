<script lang="ts">
  import '$lib/styles/app.css';

  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';
  import { page } from '$app/stores';
  import config from '$lib/config';

  import Navbar from '$components/Navbar.svelte';
  import Footer from '$components/Footer.svelte';
  import { Toaster } from '$components/ui/sonner';

  onMount(() => {
    document.documentElement.classList.add($theme);
  });

  import { settings } from '$lib/stores/settings';
</script>

<svelte:head>
  <title>{config.appName}</title>
  <link rel="icon" href="/icons/favicon.ico"/>
  <link rel="manifest" href="/manifest.json"/>
  <meta name="og:title" content={config.appName}/>
  <meta content={'https://' + $page.url.hostname} name="og:url"/>
  <meta name="og:site_name" content={config.appName}/>
  <meta content={config.meta.image} name="og:image"/>
  <meta content={config.meta.description} name="description"/>
  <meta content={config.meta.description} name="og:description"/>
  <meta content={config.meta.keywords} name="keywords"/>
  <meta content={config.meta.themeColor} name="theme-color"/>
  <meta property="twitter:title" content={config.appName}/>
  <meta content={config.meta.description} property="twitter:description"/>
  <meta content={config.meta.image} property="twitter:image"/>

  {#if config.umami.enabled && $settings.sendAnonymousData}
    <script
      defer
      src="{config.umami.url}/script.js"
      data-website-id={config.umami.websiteId}
    ></script>
  {/if}
</svelte:head>

{#if $settings.reducedMotion}
  <style>
      * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
          scroll-behavior: auto !important;
      }
  </style>
{/if}

<main class="flex flex-col bg-background text-primary">
  <div class="flex flex-col min-h-[100dvh]">
    <Navbar/>
    <Toaster/>
    <slot/>
  </div>
  <Footer/>
</main>
