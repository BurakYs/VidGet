import { z } from 'zod';

export default function sendZodError(
  validator: (val: string) => boolean,
  val: string,
  path: (string | number)[],
) {
  try {
    validator(val);
    return true;
  } catch (error: unknown) {
    throw new z.ZodError([
      {
        message: (error as Error).message,
        path,
        code: 'custom',
      },
    ]);
  }
}
