import { z } from 'zod';
import { produce, Draft } from 'immer';
import { ErrorMap } from '../types';
import { ErrorKeyCollection } from './ErrorKeyCollection';
import { Emitter } from './Emitter';

interface FormContentProps<Schema extends z.ZodObject> {
  schema: Schema;
  initialState: Partial<z.infer<Schema>>;
  /**
   * @deprecated use Zod's custom messages instead
   */
  errorMap?: Partial<ErrorMap<Schema>>;
}

export class ZodForm<Schema extends z.ZodObject> extends Emitter {
  /**
   * Actual form state
   */
  private state: Partial<z.infer<Schema>>;

  /**
   * Optional map of errors to show if a field is invalid
   */
  public errorMap?: Partial<ErrorMap<Schema>>;

  /**
   * Zod Schema for form state
   */
  public schema: Schema;

  /**
   * Result of safe parse of form state with schema
   * @private
   */
  public output: z.ZodSafeParseResult<z.infer<Schema>>;

  /**
   * Collection of which properties to show errors for
   */
  public errorKeys = new ErrorKeyCollection<Schema>();

  constructor({ schema, initialState }: FormContentProps<Schema>) {
    super();
    this.schema = schema;
    this.state = initialState;
    this.output = schema.safeParse(initialState);
  }

  /**
   * Get the current state of the form
   */
  public getState = () => {
    return this.state;
  };

  /**
   * Returns whether the form is valid
   */
  public getIsValid = () => {
    return this.output.success;
  };

  /**
   * Return error, if one exists in safe parse of form
   */
  public getError = () => {
    return this.output.error ?? null;
  };

  /**
   * Dispatch an update to form state. Uses a draft object, so no need to
   * return anything, just make the changes to the object.
   *
   * @param updater
   * @example ```ts
   * formContent.dispatch((state) => {
   *   state.someProp = 'blah';
   * });
   * ```
   */
  public dispatch = (updater: (state: Draft<Partial<z.infer<Schema>>>) => void) => {
    this.state = produce(this.state, updater);
    this.output = this.schema.safeParse(this.state);
    this.broadcast();
  };

  /**
   * Creates a simple setter for form state property
   *
   * @param key
   * @example ```tsx
   * <Input
   *   value={formState.someValue}
   *   onChangeText={formContent.createBasicSetter('someValue')}
   * />
   * ```
   */
  public createBasicSetter = <K extends string & keyof Partial<z.infer<Schema>>>(key: K) => {
    return (value: Partial<z.infer<Schema>>[K]) => {
      this.dispatch((state) => {
        if (typeof state === 'object' && key in state) {
          // @ts-expect-error - Some weirdness around Draft + generic
          state[key] = value;
        }
      });
    };
  };
}
