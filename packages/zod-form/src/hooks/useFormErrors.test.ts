import { ZodForm } from '../classes/ZodForm';
import { z } from 'zod';
import { act, renderHook } from '@testing-library/react';
import { useFormErrors } from './useFormErrors';
import { expect } from 'vitest';

const TEST_FORM_SCHEMA = z.object({
  foo: z.literal('bar'),
  obj: z.object({
    a: z.string(),
    b: z.number(),
  }),
});

describe('useFormErrors', () => {
  it('Should return an error if there are errors in the state', () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_FORM_SCHEMA,
      // @ts-expect-error this is the wrong type
      initialState: { obj: { a: 'Correct', b: 'Incorrect' } },
    });

    // Act
    const { result, rerender } = renderHook(() => useFormErrors(formContent));

    act(() => {
      for (const key of ['foo', 'obj.a', 'obj.b'] as const) {
        result.current.showForKey(key)();
      }

      rerender();
    });

    // Assert
    expect(result.current.errors).toStrictEqual({
      foo: ['Invalid input: expected "bar"'],
      'obj.b': ['Invalid input: expected number, received string'],
    });
  });

  it('Should return custom errors', () => {
    // Arrange
    const TEST_FORM_SCHEMA = z.object({
      foo: z.literal('bar', { error: "This sure don't look like 'bar'" }),
      obj: z.object({
        a: z.string(),
        b: z.number(),
      }),
    });

    const formContent = new ZodForm({
      schema: TEST_FORM_SCHEMA,
      // @ts-expect-error this is the wrong type
      initialState: { obj: { a: 'Correct', b: 'Incorrect' } },
    });

    // Act
    const { result, rerender } = renderHook(() => useFormErrors(formContent));

    act(() => {
      for (const key of ['foo', 'obj.a', 'obj.b'] as const) {
        result.current.showForKey(key)();
      }

      rerender();
    });

    // Assert
    expect(result.current.errors).toStrictEqual({
      foo: ["This sure don't look like 'bar'"],
      'obj.b': ['Invalid input: expected number, received string'],
    });
  });

  it("Should return an empty object if these aren't any errors", () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_FORM_SCHEMA,
      initialState: { foo: 'bar', obj: { a: 'Correct', b: 1234 } },
    });

    // Act
    const { result } = renderHook(() => useFormErrors(formContent));

    act(() => {
      for (const key of ['foo', 'obj.a', 'obj.b'] as const) {
        result.current.showForKey(key)();
      }
    });

    // Assert
    expect(result.current.errors).toStrictEqual({});
  });

  it('Should return errors even if not initially invalid', () => {
    // Arrange
    const validState = TEST_FORM_SCHEMA.parse({
      foo: 'bar',
      obj: { a: 'Correct', b: 1234 },
    });

    const formContent = new ZodForm({
      schema: TEST_FORM_SCHEMA,
      initialState: validState,
    });

    // Act
    const { result, rerender } = renderHook(() => useFormErrors(formContent));

    act(() => {
      formContent.dispatch((state) => {
        state.foo = undefined;
        // @ts-expect-error this is the wrong type
        state.obj.b = 'string';
      });

      rerender();

      for (const key of ['foo', 'obj.a', 'obj.b'] as const) {
        result.current.showForKey(key)();
      }
    });

    // Assert
    expect(result.current.errors).toStrictEqual({
      foo: ['Invalid input: expected "bar"'],
      'obj.b': ['Invalid input: expected number, received string'],
    });
  });

  it('Should return no errors when resetShownKeys called', () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_FORM_SCHEMA,
      initialState: { foo: 'bar', obj: { a: 'Correct', b: 1234 } },
    });

    // Act
    const { result } = renderHook(() => useFormErrors(formContent));

    act(() => {
      for (const key of ['foo', 'obj.a', 'obj.b'] as const) {
        result.current.showForKey(key)();
      }
      result.current.resetShownKeys();
    });

    // Assert
    expect(result.current.errors).toStrictEqual({});
  });
});
