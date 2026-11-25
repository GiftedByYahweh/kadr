import { ADMIN_API_PREFIX } from "./admin";

export const GalleryApiRoutes = {
    list: `${ADMIN_API_PREFIX}/galleries`,
    create: `${ADMIN_API_PREFIX}/galleries`,
    getById: `${ADMIN_API_PREFIX}/galleries/:id`,
    update: `${ADMIN_API_PREFIX}/galleries/:id`,
    trash: `${ADMIN_API_PREFIX}/galleries/:id/trash`,
    restore: `${ADMIN_API_PREFIX}/galleries/:id/restore`,
    delete: `${ADMIN_API_PREFIX}/galleries/:id`,
    regenerateShareToken: `${ADMIN_API_PREFIX}/galleries/:id/share-token`
} as const;
