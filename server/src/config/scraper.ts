const scraperConfig = {
  standardCacheTTL: 3 * 60 * 60,
  defaultUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  supportedPlatforms: [
    {
      hosts: ['vm.tiktok.com', 'vt.tiktok.com', 'www.tiktok.com', 'tiktok.com'],
      name: 'TikTok'
    },
    {
      hosts: ['twitter.com', 'x.com'],
      name: 'X'
    },
    {
      hosts: ['*.pinterest.com', 'pin.it'],
      name: 'Pinterest'
    },
    {
      hosts: ['www.instagram.com', 'instagram.com'],
      name: 'Instagram'
    }
  ]
};

export default scraperConfig;