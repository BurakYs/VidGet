import { glob } from 'glob';
import fs from 'fs/promises';

export default function deleteAssets() {
  const platforms = ['tiktok'];

  for (const platform of platforms) {
    const files = glob.sync(`./public/${platform}/*`);
    for (const file of files) {
      if (!file.endsWith('.gitkeep')) {
        fs.unlink(file).catch(() => null);
      }
    }
  }
}
