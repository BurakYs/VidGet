import { Cron } from 'croner';
import { glob } from 'glob';
import fs from 'fs/promises';

export default function deleteAssets() {
    const platforms = ['tiktok'];

    Cron('0 */3 * * *', async () => {
        for (const platform of platforms) {
            const files = await glob(`./public/${platform}/*`);
            for (const file of files) {
                if (!file.endsWith('.gitkeep')) {
                    await fs.unlink(file);
                }
            }
        }
    });
}