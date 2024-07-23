<script lang="ts">
  import { fly } from 'svelte/transition';
  import { writable } from 'svelte/store';
  import config from '$config';

  import XIcon from 'lucide-svelte/icons/x';
  import { theme } from '$lib/stores/theme';

  const isSidebarOpen = writable(false);

  const openSidebar = () => {
    isSidebarOpen.set(true);
  };

  const closeSidebar = () => {
    isSidebarOpen.set(false);
  };

  $: reversedTheme = $theme === 'dark' ? 'light' : 'dark';

  const navbarItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Source Code', href: config.githubUrl }
  ];
</script>

<div class="w-full bg-background z-30 p-4 mt-3">
    <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center flex-1">
            <a href="/">
                <div class="flex items-center gap-x-2 select-none">
                    <img alt="Icon" class="w-8 h-8" src="/icon_{reversedTheme}_64.png"/>
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
                aria-label="Open Sidebar"
                class="flex-1 flex justify-end"
                on:click={openSidebar}
                on:keydown={(e) => e.key === 'Enter' && openSidebar()}
                role="button"
                tabindex="0"
        >
            <button
                    aria-label="Open Sidebar"
                    class="md:hidden cursor-pointer"
                    type="button"
            >
                <svg
                        class="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                            d="M4 6h16M4 12h16M4 18h16"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                    ></path>
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
                class="fixed top-0 right-0 w-64 bg-background h-full z-50"
                on:click|stopPropagation
                on:keydown={() => {}}
                aria-label="Sidebar"
                role="button"
                tabindex="0"
                transition:fly={{ duration: 200, x: '100%' }}
        >
            <div class="flex justify-between items-center p-4 py-6">
                <div class="flex items-center gap-x-2">
                    <img src="/icon_{reversedTheme}_64.png" alt="Icon" class="w-8 h-8"/>
                    <span class="text-3xl font-semibold">{config.appName}</span>
                </div>
                <button on:click={closeSidebar} aria-label="Close Sidebar">
                    <XIcon class="h-6 w-6"/>
                </button>
            </div>
            <div class="flex flex-col items-start">
                {#each navbarItems as item}
                    <a
                            href={item.href}
                            class="p-4 text-muted-foreground hover:underline"
                            on:click={closeSidebar}>{item.name}</a
                    >
                {/each}
            </div>
        </div>
        <div class="fixed inset-0 bg-black bg-opacity-80"></div>
    </div>
{/if}
