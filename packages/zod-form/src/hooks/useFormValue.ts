import { ZodForm } from '../classes/ZodForm';
import { type AnyZodObject, z } from 'zod';
import { useSyncExternalStore } from 'react';
import type { ZodDeepPartial } from '../types';

interface UseFormValueSuccessResult<Schema extends AnyZodObject> {
  state: z.infer<Schema>;
  valid: true;
}

interface UseFormValueFailureResult<Schema extends AnyZodObject> {
  state: z.infer<ZodDeepPartial<Schema>>;
  valid: false;
}

type UseFormValueResult<Schema extends AnyZodObject> =
  | UseFormValueSuccessResult<Schema>
  | UseFormValueFailureResult<Schema>;

/**
 * Subscribe to FormContent state
 * @param formContent
 */
export const useFormValue = <Schema extends AnyZodObject>(
  formContent: ZodForm<Schema>
): UseFormValueResult<Schema> => {
  const state = useSyncExternalStore(formContent.subscribe, formContent.getState);
  const valid = useSyncExternalStore(formContent.subscribe, formContent.getIsValid);

  return { state, valid };
};
