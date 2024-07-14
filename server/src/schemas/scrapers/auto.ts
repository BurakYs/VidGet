import { z } from 'zod';
import sendZodError from '@/utils/validations/sendZodError';
import urlValidation from '@/utils/validations/url';

export const scrapeAuto = z.object({
  url: z.string().refine((url) => sendZodError(urlValidation, url, ['url']))
});
export type ScrapeAuto = z.infer<typeof scrapeAuto>;