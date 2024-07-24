import { ActivityType, Client as DiscordClient, type ClientPresenceStatus, GatewayIntentBits, OAuth2Scopes, Partials, PermissionsBitField } from 'discord.js';
import config from '@/config/discord';

import type { CommandData } from '@/bot/types';

type StartOptions = {
  registerCommands: boolean;
}

export default class Client extends DiscordClient<true> {
  commands: CommandData[] = [];
  commandMentions: Record<string, string> = {};

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds
      ],
      presence: {
        status: config.presence.status as ClientPresenceStatus,
        activities: [{
          name: config.presence.activity,
          state: config.presence.activity,
          type: ActivityType.Custom
        }]
      },
      partials: [Partials.Message, Partials.Channel, Partials.User]
    });
  }

  async start(options: Partial<StartOptions>) {
    if (options.registerCommands) {
      await (await import('@/bot/loaders/command')).default.loadCommands({ register: true });
      process.exit(0);
    }

    this.create();

    for (const extension of ['string', 'message']) {
      (await import(`@/bot/utils/extensions/${extension}`)).default(this);
    }

    await this.login(config.token);

    this.once('ready', async (client) => {
      global.logger.info(`Logged in as ${client.user.tag}`);

      await (await import('@/bot/loaders/command')).default.loadCommands({ client: this });
      await (await import('@/bot/loaders/event')).default(this);

      setInterval(() => {
        this.setPresence();
      }, 60000);
    });
  }

  create() {
    this.commands = [];

    process.on('unhandledRejection', (error) => global.logger.error(error));
    process.on('uncaughtException', (error) => global.logger.error(error));

    return this;
  }

  setPresence() {
    const activityName = config.presence.activity
      .replace(/{u}/g, this.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString())
      .replace(/{s}/g, this.guilds.cache.size.toString());

    return this.user.setPresence({
      status: config.presence.status as ClientPresenceStatus,
      activities: [{
        name: activityName,
        type: ActivityType.Custom,
        state: activityName
      }]
    });
  }

  getInviteURL() {
    return this.generateInvite({
      permissions: [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.SendMessagesInThreads,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.UseExternalEmojis
      ],
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands]
    });
  }
}