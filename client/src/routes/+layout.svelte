<svelte:head>
    <title>VidGet</title>
</svelte:head>

<script lang="ts">
    import '$lib/styles/app.css';
    import Navbar from '$components/Navbar/Navbar.svelte';
    import Footer from '$components/Footer/Footer.svelte';
    import ToastContainer from '$components/Toast/ToastContainer.svelte';
</script>

<main class="flex flex-col min-h-screen bg-primary text-white">
    <Navbar/>
    <slot/>
    <ToastContainer/>
</main>
<Footer/>