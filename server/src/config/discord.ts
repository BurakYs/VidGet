import { resolveColor } from 'discord.js';
import appConfig from '@/config/app';

const discordConfig = {
  // Do not enter a token if you don't want to use the bot
  token: process.env.DISCORD_BOT_TOKEN,
  defaultLanguage: 'en-US',
  supportedLanguages: {
    'en-US': 'en',
    'en-GB': 'en',
    'tr': 'tr'
  } as Record<string, string>,
  presence: {
    activity: `Visit ${appConfig.frontEndUrl}`,
    status: 'online'
  },
  supportServer: {
    id: '',
    invite: ''
  },
  embedColors: {
    default: resolveColor('#5865F2'),
    error: resolveColor('#F04A47'),
    success: resolveColor('#56B849')
  }
};

export default discordConfig;