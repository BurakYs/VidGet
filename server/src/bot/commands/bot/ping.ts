import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import appConfig from '@/config/app';

import type { CommandData } from '@/bot/types';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency and response time'),
  config: {
    category: 'Bot'
  },
  run: async ({ client, interaction }) => {
    const dateBefore = Date.now();
    await interaction.reply({ content: 'Ping' });
    const replyDate = Date.now();

    await axios.get(appConfig.rootUrl);

    await interaction.editReply({
      content: `
🏓 Pong!
Discord API: ${replyDate - dateBefore}ms
Discord Gateway: ${client.ws.ping}ms
API: ${Date.now() - replyDate}ms
`
    });
  }
} satisfies CommandData;