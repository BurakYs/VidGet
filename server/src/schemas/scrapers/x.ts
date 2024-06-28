import { z } from 'zod';
import sendZodError from '@/utils/validations/sendZodError';
import urlValidation from '@/utils/validations/url';

export const scrapePost = z.object({
  url: z.string().refine((url) => sendZodError(urlValidation, url, ['url'])),
});
export type ScrapePost = z.infer<typeof scrapePost>;
