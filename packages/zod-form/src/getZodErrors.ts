import { z } from 'zod';

function getErrors<T extends z.ZodSchema>(
  errors: ReturnType<typeof z.treeifyError<T>>,
  path?: string
): [key: string, error: string[]][] {
  if (errors.errors.length) return [[path ?? '', errors.errors]];

  const properties = errors.properties ? Object.entries(errors.properties) : [];
  if (!properties.length) return [];

  return properties.flatMap(([key, value]) => {
    const newPath = path ? `${path}.${key}` : key;
    return getErrors(value as ReturnType<typeof z.treeifyError<T>>, newPath);
  });

  // {
  //   return errors.errors.flatMap(([key, value]) => {
  //     const newPath = path ? `${path}.${key}` : key;
  //     return [[newPath, value] as [string, string[]]]
  //   })
  // }
  //
  // return Object.entries(errors).flatMap(([key, value]) => {
  //   const newPath = path ? `${path}.${key}` : key;
  //   const v = value as object;
  //
  //   if (v && 'errors' in v && Array.isArray(v.errors) && v.errors.length) {
  //     return [[newPath, v.errors] as [string, string[]]];
  //   }
  //
  //   if (typeof value === 'object' && value !== null) {
  //     return getErrors(value as ReturnType<typeof z.treeifyError<T>>, newPath);
  //   }
  //
  //   return [];
  // });
}

export const getZodErrors = <T extends z.ZodSchema>(error: z.ZodError<z.infer<T>>): any => {
  const tree = z.treeifyError(error);
  const array = getErrors(tree);
  return array.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
};
