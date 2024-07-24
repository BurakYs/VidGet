import { glob } from 'glob';

import type { Client, EventData } from '@/bot/types';

export default async (client: Client) => {
  const eventFiles = await glob('./dist/bot/events/**/*.js');

  eventFiles.map(async (value) => {
    const event: EventData = (await import(`../../../${value.replace(/\\/g, '/')}`)).default;
    if (event.dontLoad) return;

    client[event.once ? 'once' : 'on'](event.name, (...params) => event.run(client, ...params));
  });
};