<script lang="ts">
  import { fly } from 'svelte/transition';
  import { writable } from 'svelte/store';
  import { theme } from '$lib/stores/theme';
  import config from '$config';

  import * as Sheet from '$components/ui/sheet';
  import XIcon from 'lucide-svelte/icons/x';
  import MenuIcon from 'lucide-svelte/icons/menu';

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
                    <img alt="Icon" class="w-8 h-8" src="/icons/{reversedTheme}-64.png"/>
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
            >
                <MenuIcon class="h-6 w-6"/>
            </button>
        </div>
    </div>
</div>

<Sheet.Root open={$isSidebarOpen} onOpenChange={isSidebarOpen.set}>
    <Sheet.Content side="right" class="w-64 p-5">
        <Sheet.Header>
            <div class="flex items-center gap-x-2 pb-5">
                <img src="/icons/{reversedTheme}-64.png" alt="Icon" class="w-8 h-8"/>
                <span class="text-3xl font-semibold">{config.appName}</span>
            </div>
        </Sheet.Header>
        <div class="flex flex-col items-start">
            {#each navbarItems as item}
                <a
                        href={item.href}
                        class="py-4 text-muted-foreground hover:underline"
                        on:click={closeSidebar}>{item.name}</a
                >
            {/each}
        </div>
    </Sheet.Content>
</Sheet.Root>