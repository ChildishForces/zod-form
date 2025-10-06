import { z } from 'zod';

export type Key<Schema extends z.ZodObject> =
  | (string & keyof z.infer<Schema>)
  | `${string & keyof z.infer<Schema>}.${string}`;

export type Listener = () => void;

export type ErrorMap<Schema extends z.ZodObject> = {
  [K in keyof z.infer<Schema>]: string[];
} & {
  [K in keyof z.infer<Schema> as `${string & keyof z.infer<Schema>}.${string}`]: string[];
};
