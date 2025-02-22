# ZodForm

A simple utility to validate forms with a zod schema. Define a schema, provide an initial state, and use hooks to
manage form state, causing minimal re-renders. Uses immer to allow for complex immutable updates.

## ZodForm

#### getState

Synchronous function to get current state of the form.

#### getIsValid

Synchronous function to get if the state of the form conforms to the provided schema

#### getError

Synchronous function that returns any error from the current form state

#### dispatch

Function that accepts a callback, with an Immer draft of the form state as the first argument. Making modifications to
the object inside this callback will replace the form state with a brand new immutable clone of the state, plus the
modifications made.

*Example*

```ts
const schema = z.object({
  foo: z.string(),
  array: z.array(z.string()).min(2),
});

const initialState = { foo: 23, array: [] };

const form = new ZodForm({ schema, initialState });

form.dispatch((state) => {
  state.foo = 'bar';
  state.array.push('one', 'two');
});

console.log(form.getIsValid()) // true 
```

### createBasicSetter

Function that creates a basic setter, useful for things like `onChangeEvent`.

*Example*

```tsx
const form = new ZodForm({
  schema: z.object({ foo: z.string().min(3) }),
  initialState: { foo: '' },
});

const FormComponent: React.FC = () => {
  // Computed Values
  const { value: formState } = useFormValue(form);
  const handleChangeFoo = form.createBasicSetter('foo');

  return (
    <input
      value={formState.foo}
      onChangeText={handleChangeFoo}
    />
  );
}
```

## useFormErrors

Hook to get form errors. It allows you to manually enable errors, i.e. on blur, so the error is shown only when a user
has interacted with the input.

### Returns

```ts
interface UseFormErrorsResult<Schema extends AnyZodObject> {
  errors: Record<string, string | undefined>;
  showForKey: (key: Key<Schema>) => () => void;
  resetShownKeys: () => void;
}
```

*Example*

```tsx
const form = new ZodForm({
  schema: z.object({ foo: z.string().min(3) }),
  initialState: { foo: '' },
});

const FormComponent: React.FC = () => {
  // Computed Values
  const { value: formState } = useFormValue(form);
  const { errors, showForKey } = useFormErrors(form);
  const handleChangeFoo = form.createBasicSetter('foo');

  return (
    <div>
      <input
        value={formState.foo}
        onChangeText={handleChangeFoo}
        onBlur={showForKey('foo')}
      />
      {errors.foo && <p>{errors.foo}</p>}
    </div>
  );
};
```

#### errors

Record of error paths, and string values. If there is an error string provided for the key path via `errorMap` provided
in ZodForm constructor, that will be returned if there is an error with the kep path, otherwise it will fall back to
Zod's error definition.

#### showForKey

A function that accepts a key path, and returns a function that when called will enable returning the error at the
provided key path in the errors object.

#### resetShownKeys

Disables all shown keys, preventing all errors from being returned.


## useFormValue

Simple hook for returning to form state.

### Returns

```ts
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
```

*Example*

```tsx
const form = new ZodForm({
  schema: z.object({ foo: z.string().min(3) }),
  initialState: { foo: '' },
});

const FormComponent: React.FC = () => {
  // Computed Values
  const { value: formState, valid } = useFormValue(form);
  const handleChangeFoo = form.createBasicSetter('foo');
  
  // Methods
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;

    console.log(formState); // Type of formState is `{ foo: string }`
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formState.foo}
        onChangeText={handleChangeFoo}
      />
    </form>
  );
};