import {
  createGalleryRequestSchema,
  galleryIdParamsSchema,
  listGalleriesQuerySchema,
  updateGalleryRequestSchema,
} from '@kadr/shared';

export const galleryRouteSchemas = {
  list: { querystring: listGalleriesQuerySchema },
  byId: { params: galleryIdParamsSchema },
  create: { body: createGalleryRequestSchema },
  update: { params: galleryIdParamsSchema, body: updateGalleryRequestSchema },
};
