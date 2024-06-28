import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { Request, Response } from '@/interfaces';
import { glob } from 'glob';
import axios from 'axios';
import * as middlewares from '@/middlewares';
//import deleteAssets from '@/utils/deleteAssets';

export default class Server {
  public server: FastifyInstance;

  constructor() {
    this.server = Fastify();
  }

  public async create() {
    const ipAddressesToIgnore = process.env.LOG_IGNORE_IPS?.split(',') || [];

    this.server.withTypeProvider<ZodTypeProvider>().setValidatorCompiler(validatorCompiler).setSerializerCompiler(serializerCompiler);

    this.server.decorateReply('sendError', function (message, status, otherProperties) {
      return this.code(status).send({
        success: false,
        status,
        error: message,
        ...otherProperties
      });
    });

    this.server.decorateReply('sendSuccess', function (message, status, otherProperties) {
      return this.code(status).send({
        success: true,
        status,
        data: message,
        ...otherProperties
      });
    });

    this.server.addHook('onRequest', async (request) => {
      request.clientIp = middlewares.ip(request);
    });

    this.server.addHook('onResponse', async (request, response) => {
      const isIgnoredIp = ipAddressesToIgnore.includes(request.clientIp);

      if (!isIgnoredIp) {
        global.logger.logRequest(`${request.clientIp} - ${request.method} ${request.url} - ${response.statusCode}`);
      }
    });

    this.server.setErrorHandler((error: ZodError & FastifyError, _request: Request, response: Response) => {
      if (error.code === 'FST_ERR_VALIDATION') {
        response.sendError('Invalid Parameters', 400, {
          validationFailures: error.issues.map((x) => ({
            path: x.path.join('.'),
            message: x.message
          }))
        });
        return;
      }
      if (error.statusCode === 429) {
        response.sendError('Too Many Requests', 429);
        return;
      }

      global.logger.error(error);
      response.sendError('Internal Server Error', 500);
    });

    this.server.setNotFoundHandler((_request: Request, response: Response) => {
      response.sendError('Not Found', 404);
    });

    await this.registerRoutes();
    await this.registerPlugins();

    const port = parseInt(process.env.PORT || '3000');
    await this.server.listen({ port, host: '0.0.0.0' });

    axios.interceptors.response.use(
      (response) => response,
      (error) => error.response,
    );
    //deleteAssets();

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
