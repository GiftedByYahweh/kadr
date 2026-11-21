import type { Currency, GalleryStatus } from '@kadr/shared';
import type {
  Gallery,
  GalleryCounts,
  GalleryWithStats,
} from '../entities/gallery.entity.ts';

export interface CreateGalleryData {
  userId: string;
  title: string;
  shareToken: string;
  status: GalleryStatus;
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
  create(data: CreateGalleryData): Promise<Gallery>;
  update(id: string, data: UpdateGalleryData): Promise<void>;
  updateShareToken(id: string, shareToken: string): Promise<void>;
}
