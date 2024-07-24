import { EmbedBuilder } from 'discord.js';
import { Database } from '@/bot/utils/classes';
import config from '@/config/discord';

import type { Interaction, SendMessageOptions } from '@/bot/types';

const languages: Record<string, Database> = Object.entries(config.supportedLanguages).reduce((acc, [lang, key]) => {
  acc[lang] = new Database({ path: `./src/bot/localizations/${key}.json`, cache: true });
  return acc;
}, {} as Record<string, Database>);

export default class Utils {
  static createTitle(title: string | null | undefined, defaultTitle: string, emoji: string) {
    if (title?.includes(':')) return title;

    if (Math.random() < 0.9) {
      title ||= defaultTitle;
      title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
    } else if (Math.random() < 0.25) {
      title = null;
    }

    return title;
  }

  static getTranslations(interaction: Interaction, path: string) {
    const { defaultLanguage } = config;
    const defaultTranslations = languages[defaultLanguage].get(path);
    const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

    return translations || defaultTranslations;
  }

  static randomArray<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static async sendError(interaction: Interaction, options: Partial<SendMessageOptions>) {
    return await this.sendEmbed(interaction, { ...options, embedType: 'error' });
  }

  static async sendSuccess(interaction: Interaction, options: Partial<SendMessageOptions>) {
    return await this.sendEmbed(interaction, { ...options, embedType: 'success' });
  }

  private static async sendEmbed(interaction: Interaction, options: Partial<SendMessageOptions> & { embedType: 'error' | 'success' }) {
    const action = interaction.deferred || interaction.replied ? 'editReply' : options.type || 'reply';
    const randomTitle = Utils.getTranslations(interaction, options.embedType === 'error' ? 'embeds.errorTitles' : 'embeds.successTitles');

    options.title = Utils.createTitle(options.title, Utils.randomArray(randomTitle), options.embedType === 'error' ? ':x:' : ':white_check_mark:');
    options.thumbnail = typeof options.thumbnail === 'object' ? options.thumbnail.url : options.thumbnail;
    options.image = typeof options.image === 'object' ? options.image.url : options.image;

    return await interaction[action]({
      content: options.content || undefined,
      embeds: [new EmbedBuilder()
        .setAuthor(options.author || null)
        .setThumbnail(options.thumbnail || null)
        .setImage(options.image || null)
        .setTitle(options.title || null)
        .setColor(options.color || config.embedColors[options.embedType])
        .setDescription(options.description || null)
        .setFooter(options.footer || null)
        .setFields(options.fields || [])
      ],
      ephemeral: options.ephemeral || false,
      components: []
    });
  }
}