import fp from 'fastify-plugin';
import { z, ZodDefault, ZodNullable, ZodOptional, ZodTypeAny } from 'zod';

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
  while (
    schema instanceof ZodDefault ||
    schema instanceof ZodOptional ||
    schema instanceof ZodNullable
  ) {
    schema = schema._def.innerType;
  }
  return schema;
}

const queryParser = fp(async (fastify) => {
  fastify.addHook('preValidation', async (request) => {
    const routeSchema = request.routeOptions?.schema?.querystring;

    if (routeSchema && routeSchema instanceof z.ZodObject) {
      const queryParamsSchema = routeSchema.shape;

      for (const key in queryParamsSchema) {
        const originalSchema = queryParamsSchema[key];
        const paramSchema = unwrapSchema(originalSchema);
        const requestQuery = request.query as Record<string, unknown>;
        const isProvided = requestQuery[key] != null;

        if (isProvided) {
          if (paramSchema instanceof z.ZodBoolean) {
            const value = requestQuery[key];
            requestQuery[key] =
              value === 'true' ? true : value === 'false' ? false : value;
          }

          if (paramSchema instanceof z.ZodNumber) {
            const value = Number(requestQuery[key]);
            if (!isNaN(value)) {
              requestQuery[key] = value;
            }
          }

          if (paramSchema instanceof z.ZodArray) {
            if (typeof requestQuery[key] === 'string') {
              requestQuery[key] = (requestQuery[key] as string)
                .split(',')
                .map((item: string) => {
                  const arraySchema = unwrapSchema(paramSchema._def.type);
                  if (arraySchema instanceof z.ZodNumber) {
                    const num = Number(item);
                    return !isNaN(num) ? num : item;
                  } else if (arraySchema instanceof z.ZodBoolean) {
                    return item === 'true';
                  } else {
                    return item;
                  }
                });
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

export default queryParser;
