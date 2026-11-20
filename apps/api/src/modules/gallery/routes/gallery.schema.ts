import { galleryIdParamsSchema, listGalleriesQuerySchema } from '@kadr/shared';

export const galleryRouteSchemas = {
  list: { querystring: listGalleriesQuerySchema },
  byId: { params: galleryIdParamsSchema },
};
