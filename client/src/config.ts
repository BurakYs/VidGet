export default {
    hostname: 'vidget.buraky.live',
    discordUrl: 'https://discord.gg/z8aBnDa6Xa',
    rootUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://vidget-api.buraky.live',
    cdnUrl: 'https://cdn.buraky.live',
    scrapers: {
        supportedHosts: [
            {
                host: ['vm.tiktok.com', 'www.tiktok.com', 'tiktok.com'],
                name: 'TikTok'
            }
        ]
    }
};