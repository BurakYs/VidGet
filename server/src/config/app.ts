const { NODE_ENV = '', PORT = 3000, FRONTEND_PORT = 5173 } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV.toLowerCase());
const productionUrl = 'https://vidget-api.buraky.dev';

const frontEndUrl = 'https://vidget.buraky.dev';

const appConfig = {
  rootUrl: isProduction ? productionUrl : `http://localhost:${PORT}`,
  frontEndUrl: isProduction ? frontEndUrl : `http://localhost:${FRONTEND_PORT}`
};

export default appConfig;