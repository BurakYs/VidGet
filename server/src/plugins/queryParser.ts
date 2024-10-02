import fp from 'fastify-plugin';
import { z, ZodDefault, ZodNullable, ZodOptional, ZodTypeAny } from 'zod';

export default fp(async (fastify) => {
  fastify.addHook('preValidation', async (request) => {
    const routeSchema = request.routeOptions?.schema?.querystring;

    if (routeSchema && routeSchema instanceof z.ZodObject) {
      const queryParamsSchema = routeSchema.shape;

      for (const key in queryParamsSchema) {
        const originalSchema = queryParamsSchema[key];
        const paramSchema = unwrapZodSchema(originalSchema);
        const requestQuery = request.query as Record<string, unknown>;
        const value = requestQuery[key];
        const isProvided = value != null;

        if (isProvided) {
          if (paramSchema instanceof z.ZodBoolean) {
            requestQuery[key] = value === 'true' ? true : value === 'false' ? false : value;
          }

          if (paramSchema instanceof z.ZodNumber) {
            const numberValue = Number(requestQuery[key]);
            if (!isNaN(numberValue)) requestQuery[key] = numberValue;
          }

          if (paramSchema instanceof z.ZodArray) {
            if (typeof value === 'string') {
              const array = value.split(',').filter(Boolean);
              if (array.length) requestQuery[key] = array;
            }
          }
        } else {
          const func = originalSchema._def.defaultValue;
          const defaultValue = typeof func === 'function' ? func() : undefined;
          if (defaultValue != null) {
            requestQuery[key] = defaultValue;
          }
        }
      }
    }
  });
});

function unwrapZodSchema(schema: ZodTypeAny): ZodTypeAny {
  while (
    schema instanceof ZodDefault ||
    schema instanceof ZodOptional ||
    schema instanceof ZodNullable
  ) {
    schema = schema._def.innerType;
  }
  return schema;
}