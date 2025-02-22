import type { AnyZodObject } from 'zod';
import { ZodForm } from '../classes/ZodForm';
import { useMemo, useSyncExternalStore } from 'react';
import { getZodErrors } from '../getZodErrors';
import type { ErrorMap, Key, Key as OriginalKey } from '../types';

interface UseFormErrorsResult<Schema extends AnyZodObject> {
  errors: Record<string, string | undefined>;
  showForKey: (key: Key<Schema>) => () => void;
  resetShownKeys: () => void;
}

export const useFormErrors = <Schema extends AnyZodObject>(
  formContent: ZodForm<Schema>
): UseFormErrorsResult<Schema> => {
  // Types
  type Key = OriginalKey<Schema>;

  // Computed Values
  const subscribe = useMemo(() => formContent.subscribe, []);
  const keySubscribe = useMemo(() => formContent.errorKeys.subscribe, []);
  const shownKeys = useSyncExternalStore(keySubscribe, formContent.errorKeys.getKeys);
  const error = useSyncExternalStore(subscribe, formContent.getError);
  const keys = Object.keys(formContent.schema.shape) as Key[];

  const errorFormatted = useMemo(() => {
    if (!error) return null;
    return getZodErrors<Schema>(error);
  }, [error]);

  const errors = useMemo(() => {
    const value: Record<string, string | undefined> = {};
    if (!formContent.errorMap) return value;

    for (const key of Object.keys(formContent.errorMap)) {
      if (!shownKeys.has(key) || !errorFormatted?.[key]) continue;
      value[key] = formContent.errorMap?.[key] ?? errorFormatted?.[key].join(' ');
    }

    return value as Partial<ErrorMap<Schema>>;
  }, [keys, errorFormatted]);

  // Methods
  const showForKey = (key: Key) => {
    return () => formContent.errorKeys.addKey(key);
  };

  const resetShownKeys = formContent.errorKeys.resetKeys;

  return { errors, showForKey, resetShownKeys };
};
