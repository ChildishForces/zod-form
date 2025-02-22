import { ZodForm } from './ZodForm';
import { z } from 'zod';

const TEST_SCHEMA = z.object({
  foo: z.string(),
});

describe('ZodForm', () => {
  it('createBasicSetter acts as expected', () => {
    // Arrange
    const formContent = new ZodForm({
      schema: TEST_SCHEMA,
      initialState: { foo: 'start' },
    });

    // Act
    const setter = formContent.createBasicSetter('foo');
    setter('end');

    // Assert
    expect(formContent.getState()).toStrictEqual({ foo: 'end' });
  });
});
