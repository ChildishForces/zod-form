import { ZodForm } from '../classes/ZodForm';
import { z } from 'zod';
import { act, renderHook } from '@testing-library/react';
import { useFormValue } from './useFormValue';
import { expectTypeOf } from 'vitest';

const TEST_SCHEMA = z.object({
  foo: z.string(),
  bar: z.string(),
});

describe('useFormValue', () => {
  it('Should return state from FormContent', async () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_SCHEMA,
      initialState: {},
    });

    // Act
    const { result } = renderHook(() => useFormValue(formContent));

    // Assert
    expect(result.current.state).toStrictEqual({});
    expect(result.current.valid).toBe(false);
  });

  it('Should return correctly typed state if valid', async () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_SCHEMA,
      initialState: {},
    });

    // Act
    const { result, rerender } = renderHook(() => useFormValue(formContent));
    act(() => {
      formContent.dispatch((state) => {
        state.foo = 'bar';
        state.bar = 'foo';
      });
      rerender();
    });

    // Assert
    expect(result.current.state).toStrictEqual({ foo: 'bar', bar: 'foo' });
    expect(result.current.valid).toBe(true);

    if (result.current.valid) {
      expectTypeOf(result.current.state).toMatchTypeOf<z.infer<typeof TEST_SCHEMA>>();
    }
  });
});
