<svelte:head>
    <title>About</title>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import config from '$lib/config';

  import CheckIcon from 'lucide-svelte/icons/check';
  import ExternalIcon from 'lucide-svelte/icons/external-link';
  import type { APIResponse } from '$lib/types';

  let supportedPlatforms: string[] = [];

  onMount(async () => {
    const response = await fetch(`${config.apiUrl}/hosts`);
    const json: APIResponse = await response?.json().catch(() => null);
    supportedPlatforms = json?.success ? json.data as string[] : ['Error'];
  });

  const bottomButtons = [
    {
      text: 'Source Code',
      description: 'Check out the source code and contribute to our project.',
      link: config.githubUrl
    },
    {
      text: 'Donate',
      description: 'Support us by donating. We appreciate every donation.',
      link: '#footer'
    },
    {
      text: 'Discord',
      description: 'Join our Discord community to get help and discuss the project.',
      link: config.socials.find(x => x.name.toLowerCase() === 'discord')!.href
    }
  ];
</script>

<div class="flex-1 py-12 md:py-24 lg:py-32">
    <div class="container px-4 md:px-6">
        <div class="grid gap-12 md:grid-cols-2">
            <div>
                <h1 class="text-3xl font-bold sm:text-4xl md:text-5xl">
                    About
                </h1>
                <p class="mt-2 text-muted-foreground md:text-lg">
                    {config.appName} is a powerful tool that allows you to download videos/photos
                    from supported platforms.
                    <br/> Our mission is to provide a free and open-source tool that is easy
                    to use and accessible to everyone.
                </p>
            </div>
            <div>
                <h2 class="text-2xl font-bold">Supported Platforms</h2>
                <p class="mt-1 text-muted-foreground">
                    We are not affiliated with any of the platforms listed below.
                </p>
                <div class="grid gap-2 mt-4 grid-cols-{Math.min(3, Math.floor((supportedPlatforms.length - 1) / 5) + 1)}">
                    {#each supportedPlatforms as platform}
                        <div class="flex items-center">
                            <CheckIcon class="h-5 w-5 text-green-500"/>
                            <p class="ml-2 text-muted-foreground">{platform}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="flex flex-col space-y-6 mt-12">
            {#each bottomButtons as button}
                <div class="w-full">
                    <a
                            href={button.link}
                            target={button.link.startsWith('#') ? '_self' : '_blank'}
                            class="text-xl font-bold hover:underline"
                    >
                        {button.text}
                        <ExternalIcon class="h-5 w-5 inline-block ml-0.5 mb-1 ext-primary"/>
                    </a>
                    <p class="text-muted-foreground mt-1 mb-2">{button.description}</p>
                </div>
            {/each}
        </div>
    </div>
</div>
