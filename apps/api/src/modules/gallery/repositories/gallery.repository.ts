import type { Currency } from '@kadr/shared';
import type {
  Gallery,
  GalleryCounts,
  GalleryWithStats,
} from '../entities/gallery.entity.ts';

export interface CreateGalleryData {
  userId: string;
  title: string;
  shareToken: string;
  expiresAt: Date | null;
  includedCount: number;
  extraPrice: number;
  currency: Currency;
}

export interface UpdateGalleryData {
  title: string | undefined;
  expiresAt: Date | null | undefined;
  includedCount: number | undefined;
  extraPrice: number | undefined;
  currency: Currency | undefined;
}

export interface UpdateGalleryTrashData {
  trashedAt: Date | null;
  expiresAt: Date | null;
}

export interface GalleryListFilter {
  userId: string;
  trashed: boolean;
  search: string | undefined;
  limit: number;
  offset: number;
}

export interface GalleryRepository {
  countActiveAndTrashed(userId: string): Promise<GalleryCounts>;
  listWithStats(filter: GalleryListFilter): Promise<GalleryWithStats[]>;
  findOwnedWithStats(
    id: string,
    userId: string,
  ): Promise<GalleryWithStats | null>;
  create(data: CreateGalleryData): Promise<Gallery>;
  update(id: string, data: UpdateGalleryData): Promise<void>;
  updateShareToken(id: string, shareToken: string): Promise<void>;
  updateTrash(id: string, data: UpdateGalleryTrashData): Promise<void>;
  delete(id: string): Promise<void>;
}
