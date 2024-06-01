import { z } from 'zod';

export const tiktokAsset = z.object({
    name: z.string(),
    platform: z.enum(['tiktok'])
});
export type TiktokAsset = z.infer<typeof tiktokAsset>;