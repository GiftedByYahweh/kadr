import { z } from 'zod';
import { IMAGE_CONTENT_TYPES, IMAGE_MAX_SIZE_BYTES } from '../media/index.ts';
import {
  GALLERY_EXTRA_PRICE_MAX,
  GALLERY_INCLUDED_COUNT_MAX,
  GALLERY_LIST_PAGE_SIZE_MAX,
  GALLERY_TITLE_MAX_LENGTH,
  MEDIA_NAME_MAX_LENGTH,
  MEDIA_UPLOAD_BATCH_MAX,
} from './constants.ts';
import { Currency } from './types.ts';

const galleryTitleSchema = z
  .string()
  .trim()
  .min(1)
  .max(GALLERY_TITLE_MAX_LENGTH);
const galleryExpiresAtSchema = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value))
  .nullable();

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
  trashed: z.stringbool(),
  search: z.string().trim().max(GALLERY_TITLE_MAX_LENGTH).optional(),
  page: z.coerce.number().int().min(1),
  pageSize: z.coerce.number().int().min(1).max(GALLERY_LIST_PAGE_SIZE_MAX),
});

export const createGalleryRequestSchema = gallerySettingsSchema;

export const updateGalleryRequestSchema = gallerySettingsSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    error: 'At least one field is required',
  });

export const restoreGalleryRequestSchema = z.object({
  expiresAt: galleryExpiresAtSchema.optional(),
});

export const deleteGalleryQuerySchema = z.object({
  confirmTitle: z.string().max(GALLERY_TITLE_MAX_LENGTH),
});

const mediaUploadFileSchema = z.object({
  name: z.string().trim().min(1).max(MEDIA_NAME_MAX_LENGTH),
  contentType: z.enum(IMAGE_CONTENT_TYPES),
  sizeBytes: z.int().min(1).max(IMAGE_MAX_SIZE_BYTES),
});

export const startMediaUploadsRequestSchema = z.object({
  files: z.array(mediaUploadFileSchema).min(1).max(MEDIA_UPLOAD_BATCH_MAX),
});

export const confirmMediaUploadsRequestSchema = z.object({
  mediaIds: z.array(z.uuid()).min(1).max(MEDIA_UPLOAD_BATCH_MAX),
});

export type ListGalleriesQuery = z.infer<typeof listGalleriesQuerySchema>;
export type CreateGalleryRequest = z.infer<typeof createGalleryRequestSchema>;
export type UpdateGalleryRequest = z.infer<typeof updateGalleryRequestSchema>;
export type RestoreGalleryRequest = z.infer<typeof restoreGalleryRequestSchema>;
export type DeleteGalleryQuery = z.infer<typeof deleteGalleryQuerySchema>;
export type MediaUploadFile = z.infer<typeof mediaUploadFileSchema>;
export type StartMediaUploadsRequest = z.infer<
  typeof startMediaUploadsRequestSchema
>;
export type ConfirmMediaUploadsRequest = z.infer<
  typeof confirmMediaUploadsRequestSchema
>;
