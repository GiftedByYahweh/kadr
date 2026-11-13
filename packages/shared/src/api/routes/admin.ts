import { API_PREFIX } from './system.ts';

export const ADMIN_API_PREFIX = `${API_PREFIX}/admin`;

export const AdminApiRoutes = {
  auth: {
    login: `${ADMIN_API_PREFIX}/auth/login`,
    logout: `${ADMIN_API_PREFIX}/auth/logout`,
    me: `${ADMIN_API_PREFIX}/auth/me`,
  },
} as const;
