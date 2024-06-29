<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
    import config from '$config';

    const footerItems = [
        {
            title: m.footer_block_about(),
            items: [
                { name: m.footer_block_about_about_us(), href: '/about' },
                { name: m.footer_block_about_contact_us(), href: '/' }
            ]
        },
        {
            title: m.footer_block_support_us(),
            items: config.supportOptions.map(option => ({
                name: option.name,
                href: option.url
            }))
        },
        {
            title: m.footer_block_legal(),
            items: [
                { name: m.footer_block_legal_terms(), href: '/legal/terms' },
                { name: m.footer_block_legal_privacy(), href: '/legal/privacy' },
                { name: m.footer_block_legal_cookies(), href: '/legal/cookie-policy' }
            ]
        },
        {
            title: m.footer_block_social(),
            items: config.socials.map(link => ({
                name: link.name,
                href: link.url
            }))
        }
    ];
</script>

<div class="bg-secondary text-primary-text">
    <div class="container mx-auto py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {#each footerItems as item}
                <div>
                    <h3 class="text-lg font-semibold">{item.title}</h3>
                    <ul class="mt-2">
                        {#each item.items as { name, href }}
                            <li class="mb-2">
                                <a
                                        href={href}
                                        class="text-secondary-text hover:underline {!href || href === '/' && 'pointer-events-none opacity-70'}"
                                >
                                    {name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
    <div class="bg-secondary py-4">
        <div class="container mx-auto text-center text-secondary-text">
            <p>{m.footer_copyright({ year: new Date().getFullYear(), company: config.hostname })}</p>
        </div>
    </div>
</div>