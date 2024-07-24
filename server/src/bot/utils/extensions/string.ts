import type { Client } from '@/bot/types';

export default function (client: Client) {
  Object.defineProperties(String.prototype, {
    'change': {
      value: function (replacements: Record<string, unknown> = {}) {
        return this.replace(/\{([^}]+?)}/g, (match: RegExpMatchArray, key: string) => {
          if (key.startsWith('cmd:')) {
            const commandName = key.slice(4);
            return client.commandMentions[commandName] || '/' + commandName;
          }

          return replacements[key] || match;
        });
      }
    }
  });
}