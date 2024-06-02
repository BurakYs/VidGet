<script lang="ts">
    import '$lib/styles/app.css';
</script>

<svelte:head>
    <title>VidGet</title>
</svelte:head>

<main class="flex flex-col min-h-screen justify-between bg-primary text-white">
    <div class="w-full p-4 mt-3">
        <div class="container mx-auto flex justify-between items-center">
            <a href="/">
                <div class="flex items-center">
                    <img src="/icon.png" alt="Logo" width="32" height="32" class="mr-2">
                    <div class="text-3xl font-semibold">VidGet</div>
                </div>
            </a>
            <div class="flex space-x-10 items-center">
                <a href="/" class="hover:underline">Home</a>
                <a href="/about" class="hover:underline">About Us</a>
                <a href="https://github.com/BurakYs/VidGet" class="hover:underline">Source Code</a>
            </div>
            <a href="/">
                <button class="bg-primary-button text-white py-3 px-6 rounded-xl disabled:opacity-50" disabled={true}>
                    Mobile App
                </button>
            </a>
        </div>
    </div>
    <slot/>
    <div class="bg-secondary flex items-center p-4 text-secondary-text">
        <div class="mx-auto flex">
            <p class="mr-8">© 2024 vidget.buraky.live</p>
            <p class="mr-8"><a href="https://discord.gg/z8aBnDa6Xa" class="hover:underline">Discord</a></p>
            <p class="mr-8"><a href="/legal/terms" class="hover:underline">Terms of Service</a></p>
            <p><a href="/legal/privacy" class="hover:underline">Privacy Policy</a></p>
        </div>
    </div>
</main>