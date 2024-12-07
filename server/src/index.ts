import 'module-alias/register';
import 'dotenv/config';

import Logger from '@/utils/classes/Logger';
import Server from './server';

global.logger = new Logger();

const server = new Server();
server.create()
  .catch(async (err) => {
    global.logger.error(err);
    await server.server.close();
  });

process.on('unhandledRejection', (error) => global.logger.error(error));
process.on('uncaughtException', (error) => global.logger.error(error));

export default server;