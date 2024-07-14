const environment = process.env.NODE_ENV?.toLowerCase() || 'production';

export default {
  appName: 'VidGet',
  description: 'A free online video downloader that allows you to download videos from various platforms.',
  hostname: 'vidget.buraky.live',
  githubUrl: 'https://github.com/BurakYs/VidGet',
  discordUrl: 'https://discord.gg/z8aBnDa6Xa',
  apiUrl: environment === 'development' ? 'http://localhost:3000' : 'https://vidget-api.buraky.live',
  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com/BurakYs/VidGet'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/z8aBnDa6Xa'
    },
    {
      name: 'X',
      url: 'https://twitter.com/BurakYhs_'
    }
  ],
  supportOptions: [
    {
      name: 'Buy Me a Coffee',
      url: 'https://www.buymeacoffee.com/buraky'
    },
    {
      name: 'GitHub Sponsors',
      url: 'https://github.com/sponsors/BurakYs'
    },
    {
      name: 'Lemon Squeezy',
      url: '/'
    }
  ],
  downloads: {
    android: {
      enabled: false,
      url: 'https://app.buraky.live/android'
    }
  }
};