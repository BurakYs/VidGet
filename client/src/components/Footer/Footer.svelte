<script>
    import config from '$config';

    const footerNavItems = [
        { name: 'Discord', href: config.discordUrl },
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Privacy Policy', href: '/legal/privacy' }
    ];
</script>

<footer class="bg-secondary py-4 text-secondary-text text-center">
    <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-center items-center md:space-x-8">
            <p class="mb-2 md:mb-0">© {new Date().getFullYear()} {config.hostname}</p>
            {#each footerNavItems as item}
                <p class="mb-2 md:mb-0">
                    <a class="hover:underline" href={item.href}>{item.name}</a>
                </p>
            {/each}
        </div>
    </div>
</footer>