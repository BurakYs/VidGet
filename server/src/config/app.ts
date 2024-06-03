const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const frontEndUrl = 'https://vidget.buraky.live';
const productionUrl = 'https://vidget-api.buraky.live';

const AppConfig = {
    rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
    frontEndUrl,
    productionUrl,
    isProduction
};

export default AppConfig;