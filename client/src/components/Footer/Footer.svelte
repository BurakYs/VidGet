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
        <div class="flex justify-center">
            <p class="mr-8">© {new Date().getFullYear()} {config.hostname}</p>
            {#each footerNavItems as item}
                <p class="mr-8">
                    <a class="mr-2 hover:underline" href={item.href}>{item.name}</a>
                </p>
            {/each}
        </div>
    </div>
</footer>