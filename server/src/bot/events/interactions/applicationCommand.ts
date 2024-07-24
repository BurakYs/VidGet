import Utils from '@/bot/utils';
import config from '@/config/discord';

import type { Client, CommandConfig, CommandData, EventData, Interaction, ParsedCommandData } from '@/bot/types';

export default {
  name: 'applicationCommand',
  dontLoad: true,
  run: async (client: Client, interaction: Interaction) => {
    const cmd = client.commands.find(x => x.data.name === interaction.commandName);
    if (!cmd) return;

    const commandData = matchCommandData(cmd, interaction);
    const translations = Utils.getTranslations(interaction, 'general');

    if (commandData.disabled) return await interaction.error({ description: translations.commandDisabled });

    try {
      const commandTranslations = Utils.getTranslations(interaction, `commands.${interaction.commandName}`);
      await commandData.run({ client, interaction, translations: commandTranslations });
    } catch (error) {
      logger.error(error);
      await interaction.error({
        description: translations.unexpectedErrorOccurred.change({ support: config.supportServer.invite }),
        ephemeral: true
      });
    }
  }
} satisfies EventData;

function matchCommandData(command: CommandData, interaction: Interaction): ParsedCommandData {
  const matchedCommand = {
    ...command.data,
    ...command.config,
    run: command.run
  };

  const variableFields: (keyof CommandConfig)[] = [
    'disabled'
  ];

  const subcommandGroup = interaction.options.getSubcommandGroup(false);
  const subcommand = interaction.options.getSubcommand(false);
  const optionsText = [subcommandGroup, subcommand].filter(Boolean).join(' ');

  for (const [key, value] of Object.entries(command.config) as [keyof CommandConfig, Record<string, any>][]) {
    if (!variableFields.includes(key)) continue;

    const defaultValue = value['*'] ?? null;

    if (!Array.isArray(value) && typeof value === 'object') {
      matchedCommand[key] = value[optionsText] ?? defaultValue;
    }
  }

  return matchedCommand as ParsedCommandData;
}