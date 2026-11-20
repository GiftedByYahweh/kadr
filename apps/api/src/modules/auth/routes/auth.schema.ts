import { loginRequestSchema } from '@kadr/shared';

export const authRouteSchemas = {
  login: { body: loginRequestSchema },
};
