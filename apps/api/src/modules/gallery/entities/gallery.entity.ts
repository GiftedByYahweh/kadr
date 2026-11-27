import type { Currency } from '@kadr/shared';

export interface Gallery {
  id: string;
  userId: string;
  title: string;
  shareToken: string;
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

export interface GalleryCounts {
  active: number;
  trashed: number;
}
