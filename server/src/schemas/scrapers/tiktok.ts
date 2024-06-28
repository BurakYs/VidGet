import { z } from 'zod';
import sendZodError from '@/utils/validations/sendZodError';
import urlValidation from '@/utils/validations/url';

export const scrapeVideo = z.object({
  url: z.string().refine((url) => sendZodError(urlValidation, url, ['url'])),
});
export type ScrapeVideo = z.infer<typeof scrapeVideo>;
