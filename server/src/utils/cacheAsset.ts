import axios, { RawAxiosRequestHeaders } from 'axios';
import fs from 'fs/promises';
import app from '@/config/app';
import { createWriteStream } from 'fs';

export default async function cacheAsset(url: string, name: string, headers: RawAxiosRequestHeaders, stream?: boolean): Promise<string | null> {
  const fileExists = await fs.stat(`./public/${name}`).catch(() => null);
  if (fileExists) return app.rootUrl + `/assets/${name}`;

  const isDirectory = name.split('/').length;
  const directory = isDirectory && name.split('/').slice(0, -1).join('/');

  if (isDirectory) {
    const directoryExists = await fs.stat(`./public/${directory}`).catch(() => null);
    if (!directoryExists) await fs.mkdir(`./public/${directory}`, { recursive: true });
  }

  try {
    const response = await axios.get(url, {
      headers,
      responseType: stream ? 'stream' : 'arraybuffer'
    });

    if (!stream) {
      await fs.writeFile(`./public/${name}`, response.data);
      return app.rootUrl + `/assets/${name}`;
    } else {
      const writer = createWriteStream(`./public/${name}`);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(app.rootUrl + `/assets/${name}`));
        writer.on('error', reject);
      });
    }
  } catch {
    return null;
  }
}