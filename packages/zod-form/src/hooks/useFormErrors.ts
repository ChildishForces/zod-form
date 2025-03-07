import type { AnyZodObject } from 'zod';
import { ZodForm } from '../classes/ZodForm';
import { useMemo, useSyncExternalStore } from 'react';
import { getZodErrors } from '../getZodErrors';
import type { ErrorMap, Key } from '../types';

interface UseFormErrorsResult<Schema extends AnyZodObject> {
  errors: Record<string, string | undefined>;
  showForKey: (key: Key<Schema>) => () => void;
  resetShownKeys: () => void;
}

export const useFormErrors = <Schema extends AnyZodObject>(
  formContent: ZodForm<Schema>
): UseFormErrorsResult<Schema> => {
  // Computed Values
  const shownKeys = useSyncExternalStore(
    formContent.errorKeys.subscribe,
    formContent.errorKeys.getKeys
  );
  const error = useSyncExternalStore(formContent.subscribe, formContent.getError);

  const errorFormatted = useMemo(() => {
    if (!error) return null;
    return getZodErrors<Schema>(error);
  }, [error]);

  const errors = useMemo(() => {
    const value: Record<string, string | undefined> = {};

    for (const key of shownKeys) {
      if (!errorFormatted?.[key]) continue;
      value[key as string] =
        (formContent.errorMap?.[key] ?? errorFormatted?.[key]?.join('. ')) + '.';
    }

    return value as Partial<ErrorMap<Schema>>;
  }, [shownKeys, errorFormatted, formContent.errorMap]);

  // Methods
  const showForKey = (key: Key<Schema>) => {
    return () => formContent.errorKeys.addKey(key);
  };

  const resetShownKeys = formContent.errorKeys.resetKeys;

  return { errors, showForKey, resetShownKeys };
};
