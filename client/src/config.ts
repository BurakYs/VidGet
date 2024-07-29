const environment = process.env.NODE_ENV?.toLowerCase() || 'production';

export default {
  appName: 'VidGet',
  description: 'A free online video downloader that allows you to download videos from various platforms.',
  contactEmail: 'burakyhs@duck.com',
  githubUrl: 'https://github.com/BurakYs/VidGet',
  discordUrl: 'https://discord.gg/z8aBnDa6Xa',
  apiUrl: environment === 'development' ? 'http://localhost:3000' : 'https://vidget-api.buraky.live',
  meta: {
    description: 'A free online video downloader that allows you to download videos from various platforms.',
    keywords: 'video downloader, download videos, youtube downloader, facebook downloader, twitter downloader, instagram downloader, tiktok downloader, vidget, vidget downloader, vidget video downloader',
    image: '/icons/light.png',
    themeColor: '#191A1F'
  },
  umami: {
    enabled: true,
    url: 'https://umami.buraky.live',
    websiteId: 'ae9f49d2-91e3-4ceb-be86-18e9adf2a797'
  },
  socials: [
    {
      name: 'GitHub',
      href: 'https://github.com/BurakYs/VidGet'
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/z8aBnDa6Xa'
    },
    {
      name: 'X',
      href: 'https://twitter.com/BurakYhs_'
    }
  ],
  supportOptions: [
    {
      name: 'Buy Me a Coffee',
      href: 'https://www.buymeacoffee.com/buraky'
    },
    {
      name: 'GitHub Sponsors',
      href: 'https://github.com/sponsors/BurakYs'
    }
  ]
};
