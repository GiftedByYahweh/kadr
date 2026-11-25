import {z} from 'zod'
import { createGalleryRequestSchema, GalleryStatus } from '@kadr/shared';

export const createGalleryRouteSchema = {
  body: createGalleryRequestSchema,
};

export const listGalleriesRouteSchema = {
  querystring: z.object({
    status: z.nativeEnum(GalleryStatus).optional()
  })
}