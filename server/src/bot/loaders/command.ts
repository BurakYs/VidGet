import type { ApplicationCommand, Collection, SlashCommandBuilder, Snowflake } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { glob } from 'glob';
import config from '@/config/discord';
import type { Client, CommandData } from '@/bot/types';
import type { Locale } from 'discord-api-types/v10';

type CommandLocalization = {
  name: string;
  localizedName: string;
  localizedDescription: string;
  options?: CommandLocalization[];
}

type LoadOptions =
  | { client: Client; register?: false }
  | { client?: null; register: true };

export default class CommandLoader {
  static async loadCommands(options: LoadOptions) {
    const localizations: Partial<Record<Locale, CommandLocalization[]>> = {
      'en-US': (await import('@/bot/localizations/commandData/en.json')).default,
      'en-GB': (await import('@/bot/localizations/commandData/en.json')).default,
      'tr': (await import('@/bot/localizations/commandData/tr.json')).default
    };

    const folder = await glob('./dist/bot/commands/**/*.js');
    const commands: CommandData['data'][] = [];

    await Promise.all(folder.map(async value => {
      const file = (await import(`../../../${value.replace(/\\/g, '/')}`)).default;

      for (const lang in localizations) {
        const commandData = localizations[lang as Locale]!.find((x: CommandLocalization) => x.name === file.data.name);
        this.setLocalizations(lang as Locale, file.data, commandData);
      }

      commands.push(file.data);

      if (!options.register) options.client.commands.push(file);
    }));

    if (options.register) {
      const token = config.token!;
      const botId = Buffer.from(token.split('.')[0], 'base64').toString();
      const rest = new REST({ version: '10' }).setToken(token);

      await rest.put(Routes.applicationCommands(botId), { body: commands });
      global.logger.info('Loaded global slash commands');
    } else {
      this.setCommandMentions(options.client, await options.client.application.commands.fetch());
    }
  }

  static setCommandMentions(client: Client, commands: Collection<Snowflake, ApplicationCommand>) {
    client.commandMentions = {};

    commands.forEach(x => {
      client.commandMentions[x.name] = `</${x.name}:${x.id}>`;

      x.options
        ?.filter(x => x.type === 1)
        .forEach(y => {
          client.commandMentions[`${x.name} ${y.name}`] = `</${x.name} ${y.name}:${x.id}>`;
        });
    });
  }

  static setLocalizations(lang: Locale, command: SlashCommandBuilder, commandData: CommandLocalization | undefined) {
    if (!commandData) return;

    command.setNameLocalization(lang, commandData.localizedName);
    command.setDescriptionLocalization(lang, commandData.localizedDescription);

    if (command.options?.length)
      command.options.forEach((opt: unknown) => {
        const option = opt as SlashCommandBuilder;
        this.setLocalizations(lang, option, commandData.options?.find(x => x.name === option.name));
      });
  }
}