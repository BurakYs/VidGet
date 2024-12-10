<script lang="ts">
  import config from '$lib/config';
  import { page } from '$app/stores';

  const footerBlocks = [
    {
      title: 'About',
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: `mailto:${config.contactEmail}` }
      ]
    },
    {
      title: 'Support Us',
      items: config.supportOptions.map((x) => ({ ...x, target: '_blank' }))
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Privacy Policy', href: '/legal/privacy' }
      ]
    },
    {
      title: 'Social',
      items: config.socials.map((x) => ({ ...x, target: '_blank' }))
    }
  ];
</script>

<div class="bg-muted-foreground/[0.065] border-t border-border" id="footer">
  <div class="container mx-auto py-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {#each footerBlocks as block}
        <div>
          <h1 class="text-lg text-primary font-semibold">{block.title}</h1>
          <ul class="mt-2">
            {#each block.items as item}
              <li class="mb-2">
                <a
                  href={item.href}
                  target={item.target}
                  class="text-muted-foreground hover:underline {(!item.href || item.href === '/') && 'pointer-events-none opacity-70'}"
                >
                  {item.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
  <div class="py-4">
    <div class="container mx-auto text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} {$page.url.hostname}</p>
    </div>
  </div>
</div>
