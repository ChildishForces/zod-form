import { ZodForm } from '../classes/ZodForm';
import { z } from 'zod';
import { useSyncExternalStore } from 'react';

interface UseFormValueSuccessResult<Schema extends z.ZodObject> {
  state: z.infer<Schema>;
  valid: true;
}

interface UseFormValueFailureResult<Schema extends z.ZodObject> {
  state: Partial<z.infer<Schema>>;
  valid: false;
}

type UseFormValueResult<Schema extends z.ZodObject> =
  | UseFormValueSuccessResult<Schema>
  | UseFormValueFailureResult<Schema>;

/**
 * Subscribe to FormContent state
 * @param formContent
 */
export const useFormValue = <Schema extends z.ZodObject>(
  formContent: ZodForm<Schema>
): UseFormValueResult<Schema> => {
  const state = useSyncExternalStore(
    formContent.subscribe,
    formContent.getState,
    formContent.getState
  );

  const valid = useSyncExternalStore(
    formContent.subscribe,
    formContent.getIsValid,
    formContent.getIsValid
  );

  return { state, valid } as UseFormValueResult<Schema>;
};
