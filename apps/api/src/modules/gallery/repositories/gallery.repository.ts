import type { GalleryStatus } from '@kadr/shared';
import type {
  GalleryCounts,
  GalleryWithStats,
} from '../entities/gallery.entity.ts';

export interface GalleryListFilter {
  userId: string;
  status: GalleryStatus;
  search: string | undefined;
  limit: number;
  offset: number;
}

export interface GalleryRepository {
  countByStatus(userId: string): Promise<GalleryCounts>;
  listWithStats(filter: GalleryListFilter): Promise<GalleryWithStats[]>;
  findOwnedWithStats(
    id: string,
    userId: string,
  ): Promise<GalleryWithStats | null>;
}
