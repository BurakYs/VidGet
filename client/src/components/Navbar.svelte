<script lang="ts">
    import { fly } from 'svelte/transition';
    import { writable } from 'svelte/store';
    import isNative from '$lib/isNative';
    import * as m from '$lib/paraglide/messages.js';
    import config from '$config';

    const isSidebarOpen = writable(false);

    const openSidebar = () => {
        isSidebarOpen.set(true);
    };

    const closeSidebar = () => {
        isSidebarOpen.set(false);
    };

    const navbarItems = [
        { name: m.navigation_home(), href: '/' },
        { name: m.navigation_about_us(), href: '/about' },
        { name: m.navigation_source_code(), href: config.githubUrl }
    ];
</script>

<div class="w-full bg-primary z-30 p-4 mt-3">
    <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center flex-1">
            <a href="/">
                <div class="flex items-center gap-x-2 select-none">
                    <img src="/icon_64.png" alt="Icon" class="h-8 w-8"/>
                    <span class="text-3xl font-semibold">{config.appName}</span>
                </div>
            </a>
        </div>
        <div class="hidden md:flex gap-x-8 justify-center">
            {#each navbarItems as item}
                <a href={item.href} class="hover:underline">{item.name}</a>
            {/each}
        </div>
        <div
                class="flex-1 flex justify-end"
                on:click={openSidebar}
                on:keydown={(e) => e.key === 'Enter' && openSidebar()}
                aria-label="Open Sidebar"
                role="button"
                tabindex="0"
        >
            <button aria-label="Open Sidebar" type="button" class="md:hidden cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </div>
</div>

{#if $isSidebarOpen}
    <div
            class="fixed inset-0 z-40"
            on:click={closeSidebar}
            on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
            aria-label="Close Sidebar"
            role="button"
            tabindex="0"
    >
        <div
                class="fixed top-0 right-0 w-64 bg-secondary h-full z-50"
                on:click|stopPropagation
                on:keydown={() => {}}
                aria-label="Sidebar"
                role="button"
                tabindex="0"
                transition:fly={{ duration: 200, x: '100%' }}
        >
            <div class="flex justify-between items-center p-4 py-6">
                <div class="flex items-center gap-x-2">
                    <img src="/icon_64.png" alt="Icon" class="h-8 w-8"/>
                    <span class="text-3xl font-semibold">{config.appName}</span>
                </div>
                <button on:click={closeSidebar} aria-label="Close Sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="flex flex-col items-start">
                {#each navbarItems as item}
                    <a href={item.href} class="p-4 text-secondary-text hover:underline"
                       on:click={closeSidebar}>{item.name}</a>
                {/each}
            </div>
            {#if !isNative()}
                <div class="absolute bottom-0 w-full p-4">
                    <a href={config.downloads.android}
                       class="bg-primary-button w-full text-primary-text py-3 px-6 rounded-xl disabled:opacity-50 text-center block">
                        {m.navigation_android_app()}
                    </a>
                </div>
            {/if}
        </div>
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
    </div>
{/if}