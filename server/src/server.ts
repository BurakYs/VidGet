import Fastify, { type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { glob } from 'glob';
import axios from 'axios';
import deleteAssets from '@/utils/deleteAssets';

export default class Server {
  public server: FastifyInstance;

  constructor() {
    this.server = Fastify();
  }

  public async create() {
    const ipAddressesToIgnore = process.env.LOG_IGNORE_IPS?.split(',') || [];

    this.server
      .withTypeProvider<ZodTypeProvider>()
      .setValidatorCompiler(validatorCompiler)
      .setSerializerCompiler(serializerCompiler);

    this.server.decorateReply('sendError', function (message, status, otherProperties) {
      return this.code(status).send({ success: false, status, error: message, ...otherProperties });
    });

    this.server.decorateReply('sendSuccess', function (message, status, otherProperties) {
      return this.code(status).send({ success: true, status, data: message, ...otherProperties });
    });

    this.server.addHook('onRequest', async (request) => {
      request.clientIp = (request.headers['x-forwarded-for'] as string || request.ip).split(',').at(-1)!;
    });

    this.server.addHook('onResponse', async (request, response) => {
      const isIgnoredIp = ipAddressesToIgnore.includes(request.clientIp);

      if (!isIgnoredIp) {
        global.logger.logRequest(`${request.clientIp} - ${request.method} ${request.url} - ${response.statusCode}`);
      }
    });

    this.server.setErrorHandler((error: ZodError & FastifyError, _request: FastifyRequest, response: FastifyReply) => {
      if (error.code === 'FST_ERR_VALIDATION')
        return response.sendError('Invalid parameters provided', 400, {
          validationFailures: error.issues.map((x) => ({
            path: x.path.join('.'),
            message: x.message
          }))
        });

      if (error.statusCode === 429)
        return response.sendError('You are sending too many requests', 429);

      global.logger.error(error);
      response.sendError('An error occurred on our side', 500);
    });

    this.server.setNotFoundHandler((_request: FastifyRequest, response: FastifyReply) => {
      response.sendError('Page not found', 404);
    });

    await this.registerPlugins();
    await this.registerRoutes();

    const port = parseInt(process.env.PORT || '3000');
    await this.server.listen({ port, host: '0.0.0.0' });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isStream = error.response.config?.responseType === 'stream';
        if (isStream) throw error;

        return error.response;
      }
    );

    deleteAssets();

    return port;
  }

  private async registerRoutes() {
    const files = await glob('./dist/routes/**/*.js');

    for (let file of files) {
      file = './' + file.replace(/\\/g, '/').substring(file.indexOf('routes'));
      let prefix = file.substring(8, file.length - 3);
      if (prefix.endsWith('/index')) prefix = prefix.substring(0, prefix.length - 6) || '/';

      const route = await import(file);
      this.server.register(route.default, { prefix });
    }
  }

  private async registerPlugins() {
    const files = await glob('./dist/plugins/**/*.js');

    for (let file of files) {
      file = './' + file.replace(/\\/g, '/').substring(file.indexOf('plugins'));

      const plugin = await import(file);
      this.server.register(plugin.default);
    }
  }
}