<script lang="ts">
    import { onMount } from 'svelte';

    const navbarItems = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Source Code', href: 'https://github.com/BurakYs/VidGet' }
    ];

    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function closeSidebar() {
        isSidebarOpen = false;
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside, true);
    });

    function handleClickOutside(event: MouseEvent) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target as Node) && isSidebarOpen) {
            closeSidebar();
        }
    }
</script>

<div class="w-full p-4 mt-3">
    <div class="container mx-auto flex items-center">
        <div class="flex items-center flex-1">
            <a href="/">
                <div class="flex items-center">
                    <img src="/icon.png" alt="Logo" width="32" height="32" class="mr-2">
                    <div class="text-3xl font-semibold">VidGet</div>
                </div>
            </a>
        </div>
        <div class="hidden sm:flex space-x-10 justify-center">
            {#each navbarItems as item}
                <a href={item.href} class="hover:underline">{item.name}</a>
            {/each}
        </div>
        <div class="flex-1 flex justify-end">
            <button aria-label="Open Sidebar" type="button" class="sm:hidden cursor-pointer" on:click={toggleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </div>
</div>

<div
        class={`fixed top-0 left-0 w-full h-full bg-black transition-opacity duration-200 ease-in-out ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        on:keydown={closeSidebar}
        aria-label="Close Sidebar"
        role="button"
        tabindex="0"
></div>

<div id="sidebar"
     class={`fixed top-0 right-0 w-64 h-full bg-secondary transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} `}>
    <div class="flex flex-col h-full">
        <div class="flex justify-between">
            <div class="flex items-center px-4 py-6">
                <img src="/icon.png" alt="Logo" width="32" height="32" class="mr-2">
                <div class="text-3xl font-semibold">VidGet</div>
            </div>
            <button on:click={closeSidebar} class="text-white p-4" aria-label="Close Sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="flex-1">
            {#each navbarItems as item}
                <a href={item.href} class="block p-4 text-secondary-text font-light">{item.name}</a>
            {/each}
        </div>
        <div class="p-4">
            <a href="/">
                <button class="bg-primary-button w-full text-white py-3 px-6 rounded-xl disabled:opacity-50"
                        disabled={true}>
                    Mobile App
                </button>
            </a>
        </div>
    </div>
</div>