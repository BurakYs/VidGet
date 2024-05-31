const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());

const AppConfig = {
    rootUrl: isProduction ? 'https://downloader.buraky.live' : `http://localhost:${PORT}`,
    isProduction
};

export default AppConfig;