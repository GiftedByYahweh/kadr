import {
  createGalleryRequestSchema,
  deleteGalleryQuerySchema,
  galleryIdParamsSchema,
  listGalleriesQuerySchema,
  restoreGalleryRequestSchema,
  updateGalleryRequestSchema,
} from '@kadr/shared';

export const galleryRouteSchemas = {
  list: { querystring: listGalleriesQuerySchema },
  byId: { params: galleryIdParamsSchema },
  create: { body: createGalleryRequestSchema },
  update: { params: galleryIdParamsSchema, body: updateGalleryRequestSchema },
  restore: { params: galleryIdParamsSchema, body: restoreGalleryRequestSchema },
  delete: {
    params: galleryIdParamsSchema,
    querystring: deleteGalleryQuerySchema,
  },
};
