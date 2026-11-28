import type { AdminGalleryMediaDto } from '@kadr/shared';
import { toIsoOrNull } from '@common/utils/date.ts';
import type { GalleryMedia } from '../entities/gallery-media.entity.ts';
import type { galleryMediaTable } from '../tables/gallery-media.table.ts';

type GalleryMediaRow = typeof galleryMediaTable.$inferSelect;

export const galleryMediaMapper = {
  toEntity(row: GalleryMediaRow): GalleryMedia {
    return {
      id: row.id,
      galleryId: row.galleryId,
      originalName: row.originalName,
      storageKey: row.storageKey,
      previewKey: row.previewKey,
      status: row.status,
      contentType: row.contentType,
      sizeBytes: row.sizeBytes,
      width: row.width,
      height: row.height,
      position: row.position,
      likedAt: row.likedAt,
      isCover: row.isCover,
      createdAt: row.createdAt,
    };
  },

  toAdminDto(media: GalleryMedia): AdminGalleryMediaDto {
    return {
      id: media.id,
      originalName: media.originalName,
      status: media.status,
      position: media.position,
      isCover: media.isCover,
      likedAt: toIsoOrNull(media.likedAt),
      createdAt: media.createdAt.toISOString(),
    };
  },
};
