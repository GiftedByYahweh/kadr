import {z} from 'zod';
import { GALLERY_TITLE_MAX_LENGHT } from './constants';

export const createGalleryRequestSchema = z.object({
    title: z.string().max(GALLERY_TITLE_MAX_LENGHT),
    includedCount: z.number().int().positive(),
    extraPrice: z.number().int().nonnegative(),
    expiresAt: z.string().datetime().nullable().optional(),
})

export type createGalleryRequest = z.infer<typeof createGalleryRequestSchema>