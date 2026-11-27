import type {
  AdminGalleryCountsDto,
  AdminGalleryDto,
  AdminGalleryListItemDto,
} from '@kadr/shared';
import { toIsoOrNull } from '@common/utils/date.ts';
import type {
  Gallery,
  GalleryCounts,
  GalleryWithStats,
} from '../entities/gallery.entity.ts';
import type { galleriesTable } from '../tables/galleries.table.ts';

type GalleryRow = typeof galleriesTable.$inferSelect;

interface GalleryWithStatsRow {
  gallery: GalleryRow;
  mediaCount: number;
  likedCount: number;
}

export const galleryMapper = {
  toEntity(row: GalleryRow): Gallery {
    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      shareToken: row.shareToken,
      expiresAt: row.expiresAt,
      trashedAt: row.trashedAt,
      includedCount: row.includedCount,
      extraPrice: row.extraPrice,
      currency: row.currency,
      selectionSubmittedAt: row.selectionSubmittedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  toEntityWithStats(row: GalleryWithStatsRow): GalleryWithStats {
    const gallery = galleryMapper.toEntity(row.gallery);
    return {
      ...gallery,
      mediaCount: row.mediaCount,
      likedCount: row.likedCount,
    };
  },

  toAdminListItemDto(gallery: GalleryWithStats): AdminGalleryListItemDto {
    return {
      id: gallery.id,
      title: gallery.title,
      expiresAt: toIsoOrNull(gallery.expiresAt),
      trashedAt: toIsoOrNull(gallery.trashedAt),
      createdAt: gallery.createdAt.toISOString(),
      includedCount: gallery.includedCount,
      extraPrice: gallery.extraPrice,
      currency: gallery.currency,
      selectionSubmittedAt: toIsoOrNull(gallery.selectionSubmittedAt),
      mediaCount: gallery.mediaCount,
      likedCount: gallery.likedCount,
      coverUrl: null,
    };
  },

  toAdminDto(gallery: GalleryWithStats, galleryUrl: string): AdminGalleryDto {
    const listItem = galleryMapper.toAdminListItemDto(gallery);
    return {
      ...listItem,
      shareUrl: `${galleryUrl}/${gallery.shareToken}`,
    };
  },

  toAdminCountsDto(counts: GalleryCounts): AdminGalleryCountsDto {
    return {
      active: counts.active,
      trashed: counts.trashed,
    };
  },
};
