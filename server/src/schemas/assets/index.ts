import { z } from 'zod';

export const assetParams = z.object({
  '*': z.string(),
});
export type AssetParams = z.infer<typeof assetParams>;
