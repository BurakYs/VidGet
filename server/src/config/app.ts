const { NODE_ENV = '', PORT = 3000, FRONTEND_PORT = 5173 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const productionUrl = 'https://vidget-api.buraky.live';

const frontEndUrl = 'https://vidget.buraky.live';
const frontEndPort = FRONTEND_PORT;

const AppConfig = {
  rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
  frontEndUrl: isProduction ? frontEndUrl : `http://localhost:${frontEndPort}`,
  standardCacheTTL: 3 * 60 * 60,
  defaultUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
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