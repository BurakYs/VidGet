const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const productionUrl = 'https://vidget-api.buraky.live';

const AppConfig = {
  rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
  supportedPlatforms: [
    {
      hosts: ['vm.tiktok.com', 'vt.tiktok.com', 'www.tiktok.com', 'tiktok.com'],
      name: 'TikTok'
    },
    {
      hosts: ['twitter.com', 'x.com', 't.co'],
      name: 'X'
    }
  ]
};

export default AppConfig;