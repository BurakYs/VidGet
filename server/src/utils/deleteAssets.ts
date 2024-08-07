import { glob } from 'glob';
import fs from 'fs/promises';
import scraperConfig from '@/config/scraper';

export default function deleteAssets() {
  if (process.env.NODE_ENV === 'development') return;

  const platforms = scraperConfig.supportedPlatforms.map(x => x.name.toLowerCase());

  for (const platform of platforms) {
    const files = glob.sync(`./public/${platform}/**/*`);
    for (const file of files) {
      if (file.endsWith('.gitkeep')) continue;
      fs.unlink(file).catch(() => null);
    }
  }
}