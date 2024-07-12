<script lang="ts">
  import config from '$config';

  const footerItems = [
    {
      title: 'About',
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/' }
      ]
    },
    {
      title: 'Support Us',
      items: config.supportOptions.map(option => ({
        name: option.name,
        href: option.url
      }))
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Privacy Policy', href: '/legal/privacy' },
        { name: 'Cookie Policy', href: '/legal/cookie-policy' }
      ]
    },
    {
      title: 'Social',
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
            <p>&copy; {new Date().getFullYear()} {config.hostname}</p>
        </div>
    </div>
</div>