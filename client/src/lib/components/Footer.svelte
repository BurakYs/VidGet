<script lang="ts">
  import config from '$lib/config';
  import { page } from '$app/stores';

  const footerItems = [
    {
      title: 'About',
      items: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: `mailto:${config.contactEmail}` }
      ]
    },
    {
      title: 'Support Us',
      items: config.supportOptions
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
      items: config.socials
    }
  ];
</script>

<div class="bg-muted-foreground/[0.065] border-t border-border" id="footer">
  <div class="container mx-auto py-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {#each footerItems as item}
        <div>
          <h1 class="text-lg text-primary font-semibold">{item.title}</h1>
          <ul class="mt-2">
            {#each item.items as { name, href }}
              <li class="mb-2">
                <a
                  {href}
                  target="_blank"
                  class="text-muted-foreground hover:underline {!href || (href === '/' && 'pointer-events-none opacity-70')}"
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
  <div class="py-4">
    <div class="container mx-auto text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} {$page.url.hostname}</p>
    </div>
  </div>
</div>
