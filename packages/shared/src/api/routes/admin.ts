import { API_PREFIX } from './system.ts';

export const ADMIN_API_PREFIX = `${API_PREFIX}/admin`;

const ADMIN_GALLERIES = `${ADMIN_API_PREFIX}/galleries`;
const ADMIN_GALLERY = `${ADMIN_GALLERIES}/:id`;

export const AdminApiRoutes = {
  auth: {
    login: `${ADMIN_API_PREFIX}/auth/login`,
    logout: `${ADMIN_API_PREFIX}/auth/logout`,
    me: `${ADMIN_API_PREFIX}/auth/me`,
  },
  galleries: {
    list: ADMIN_GALLERIES,
    counts: `${ADMIN_GALLERIES}/counts`,
    byId: ADMIN_GALLERY,
    trash: `${ADMIN_GALLERY}/trash`,
    restore: `${ADMIN_GALLERY}/restore`,
    shareToken: `${ADMIN_GALLERY}/share-token`,
    media: `${ADMIN_GALLERY}/media`,
    mediaUploads: `${ADMIN_GALLERY}/media/uploads`,
  },
} as const;
