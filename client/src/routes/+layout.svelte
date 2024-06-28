<svelte:head>
    <title>{config.appName}</title>
    <link href="/favicon.ico" rel="icon"/>
    <meta name="og:title" content={config.appName}>
    <meta name="og:url" content={'https://' + config.hostname}>
    <meta name="og:site_name" content={config.appName}>
    <meta name="og:image" content="/icon.png">
    <meta name="description" content={config.description}>
    <meta name="og:description" content={config.description}>
    <meta name="keywords" content="video downloader, tiktok downloader, instagram downloader, twitter downloader">
    <meta name="theme-color" content="#191A1F">
    <meta property="twitter:title" content={config.appName}>
    <meta property="twitter:description" content={config.description}>
    <meta property="twitter:image" content="/icon.png">
</svelte:head>

<script lang="ts">
    import config from '$config';

    import '$lib/styles/app.css';
    import Navbar from '$components/Navbar.svelte';
    import Footer from '$components/Footer.svelte';
    import ToastContainer from '$components/Toast/ToastContainer.svelte';
</script>

<main class="flex flex-col min-h-screen bg-primary text-primary-text scrollbar">
    <Navbar/>
    <slot/>
    <ToastContainer/>
</main>
<Footer/>