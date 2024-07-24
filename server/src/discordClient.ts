import Client from '@/bot/loaders/base';

const argv = process.argv.slice(2).reduce((acc: Record<string, string | boolean>, arg) => {
  // eslint-disable-next-line prefer-const
  let [key, value] = arg.split('=');
  if (key.startsWith('-')) key = key.replace(/^-+/, '');

  acc[key] = value || true;
  return acc;
}, {});

const redeployCommands = argv.redeployCommands || argv.redeploy;

function startDiscordBot() {
  new Client().start({
    registerCommands: !!redeployCommands
  });
}

export default startDiscordBot;