const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const productionUrl = 'https://vidget.buraky.live';

const AppConfig = {
    rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
    productionUrl,
    isProduction
};

export default AppConfig;