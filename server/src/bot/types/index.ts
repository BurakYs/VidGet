import type {
  ChatInputCommandInteraction,
  ColorResolvable,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import type BClient from '@/bot/loaders/base';

export type Client = BClient;
export type RunFunctionOptions = { client: Client, interaction: Interaction, translations: Record<string, any> }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type PrimitiveOrDictionary<T, P> = P extends true ? T : T | Record<string, T>;

export type CommandConfig<P = false> = {
  category: string;
  disabled?: PrimitiveOrDictionary<boolean, P>;
}

export type CommandData = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  config: CommandConfig;
  run: RunFunction;
}

export type Interaction = ChatInputCommandInteraction & {
  language?: string;
  success: (options: Partial<SendMessageOptions>) => Promise<Message>;
  error: (options: Partial<SendMessageOptions>) => Promise<Message>;
}

export type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type ParsedCommandData = CommandConfig<true> & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export type SendMessageOptions = {
  title: string | null;
  thumbnail: string | { url: string };
  image: string | { url: string };
  content: string | null;
  author: { name: string; iconURL?: string } | null;
  color: ColorResolvable;
  description: string;
  footer: { text: string; iconURL?: string };
  fields: { name: string; value: string; inline?: boolean }[];
  ephemeral: boolean;
  type: 'reply' | 'editReply' | 'followUp';
}

export type EventRunFunction = (client: Client, ...args: any[]) => Promise<unknown>;

export type EventData = {
  name: string;
  once?: boolean;
  dontLoad?: boolean;
  run: EventRunFunction;
}