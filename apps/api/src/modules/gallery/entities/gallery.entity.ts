import type { Currency, GalleryStatus } from '@kadr/shared';

export interface Gallery {
  id: string;
  userId: string;
  title: string;
  shareToken: string;
  status: GalleryStatus;
  expiresAt: Date | null;
  trashedAt: Date | null;
  includedCount: number;
  extraPrice: number;
  currency: Currency;
  selectionSubmittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryWithStats extends Gallery {
  mediaCount: number;
  likedCount: number;
}

export type GalleryCounts = Record<GalleryStatus, number>;
