const { NODE_ENV = '', PORT = 3000 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const productionUrl = 'https://vidget-api.buraky.live';

const AppConfig = {
  rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
};

export default AppConfig;
