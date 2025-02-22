import {
  AnyZodObject,
  z,
  type ZodArray,
  type ZodNullable,
  type ZodObject,
  type ZodOptional,
  type ZodRawShape,
  type ZodTuple,
  type ZodTupleItems,
  type ZodTypeAny,
} from 'zod';

export type Key<Schema extends AnyZodObject> =
  | keyof z.infer<Schema>
  | `${string & keyof z.infer<Schema>}.${string}`;

export type Listener = () => void;

export type ErrorMap<Schema extends AnyZodObject> = {
  [K in keyof z.infer<Schema>]: string;
} & {
  [K in keyof z.infer<Schema> as `${string & keyof z.infer<Schema>}.${string}`]: string;
};

export type ZodDeepPartial<T extends ZodTypeAny> =
  T extends ZodObject<ZodRawShape>
    ? ZodObject<
        {
          [k in keyof T['shape']]: ZodOptional<ZodDeepPartial<T['shape'][k]>>;
        },
        T['_def']['unknownKeys'],
        T['_def']['catchall']
      >
    : T extends ZodArray<infer Type, infer Card>
      ? ZodArray<ZodDeepPartial<Type>, Card>
      : T extends ZodOptional<infer Type>
        ? ZodOptional<ZodDeepPartial<Type>>
        : T extends ZodNullable<infer Type>
          ? ZodNullable<ZodDeepPartial<Type>>
          : T extends ZodTuple<infer Items>
            ? {
                [k in keyof Items]: Items[k] extends ZodTypeAny ? ZodDeepPartial<Items[k]> : never;
              } extends infer PI
              ? PI extends ZodTupleItems
                ? ZodTuple<PI>
                : never
              : never
            : T;
