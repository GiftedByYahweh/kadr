import { z } from 'zod';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './constants.ts';

export const loginRequestSchema = z.object({
  email: z.email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
