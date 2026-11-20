import { z } from 'zod';
import {
  GALLERY_EXTRA_PRICE_MAX,
  GALLERY_INCLUDED_COUNT_MAX,
  GALLERY_LIST_PAGE_SIZE_MAX,
  GALLERY_TITLE_MAX_LENGTH,
  GalleryStatus,
} from './constants.ts';
import { Currency } from './types.ts';

const galleryTitleSchema = z
  .string()
  .trim()
  .min(1)
  .max(GALLERY_TITLE_MAX_LENGTH);
const galleryExpiresAtSchema = z.iso.datetime({ offset: true }).nullable();

const gallerySettingsSchema = z.object({
  title: galleryTitleSchema,
  expiresAt: galleryExpiresAtSchema,
  includedCount: z.int().min(0).max(GALLERY_INCLUDED_COUNT_MAX),
  extraPrice: z.int().min(0).max(GALLERY_EXTRA_PRICE_MAX),
  currency: z.enum(Currency),
});

export const galleryIdParamsSchema = z.object({
  id: z.uuid(),
});

export const listGalleriesQuerySchema = z.object({
  status: z.enum(GalleryStatus),
  search: z.string().trim().max(GALLERY_TITLE_MAX_LENGTH).optional(),
  page: z.coerce.number().int().min(1),
  pageSize: z.coerce.number().int().min(1).max(GALLERY_LIST_PAGE_SIZE_MAX),
});

export const createGalleryRequestSchema = gallerySettingsSchema;

export const updateGalleryRequestSchema = gallerySettingsSchema.partial();

export const restoreGalleryRequestSchema = z.object({
  expiresAt: galleryExpiresAtSchema.optional(),
});

export const deleteGalleryQuerySchema = z.object({
  confirmTitle: z.string().max(GALLERY_TITLE_MAX_LENGTH),
});

export type ListGalleriesQuery = z.infer<typeof listGalleriesQuerySchema>;
export type CreateGalleryRequest = z.infer<typeof createGalleryRequestSchema>;
export type UpdateGalleryRequest = z.infer<typeof updateGalleryRequestSchema>;
export type RestoreGalleryRequest = z.infer<typeof restoreGalleryRequestSchema>;
export type DeleteGalleryQuery = z.infer<typeof deleteGalleryQuerySchema>;
