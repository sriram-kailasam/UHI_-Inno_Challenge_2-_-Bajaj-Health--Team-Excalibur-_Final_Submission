import { z } from 'zod';

export async function validateSchema(data: unknown, schema: z.ZodSchema): Promise<unknown> {
  try {
    return await schema.parse(data);
  } catch (error) {
    const issue = (error as z.ZodError).issues[0];

    const path = issue.path?.join('.');
    const reason = issue.message;

    throw new Error(`Validation error - ${path}: ${reason}`);
  }
}
