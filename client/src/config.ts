export default {
    rootUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://vidget-api.buraky.live',
    cdnUrl: 'https://cdn.buraky.live',
    scrapers: {
        supportedHosts: [
            'vm.tiktok.com',
            'www.tiktok.com',
            'tiktok.com'
        ]
    }
};