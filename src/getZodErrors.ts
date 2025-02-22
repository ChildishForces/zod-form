import { ZodSchema, z } from 'zod';

function getErrors<T extends ZodSchema>(
  errors: z.ZodFormattedError<T>,
  path: string = ''
): [key: string, error: string[]][] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const newPath = path ? `${path}.${key}` : key;
    const v = value as object;

    if (v && '_errors' in v && Array.isArray(v._errors) && v._errors.length) {
      return [[newPath, v._errors] as [string, string[]]];
    }

    if (typeof value === 'object' && value !== null) {
      return getErrors(value as z.ZodFormattedError<T>, newPath);
    }

    return [];
  });
}

export const getZodErrors = <T extends ZodSchema>(error: z.ZodError<z.infer<T>>): any => {
  const array = getErrors(error.format());
  return array.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {}
  );
};
