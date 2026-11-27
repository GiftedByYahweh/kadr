import type { Currency } from '@kadr/shared';

export interface GalleryListQuery {
  trashed: boolean;
  search: string;
  page: number;
  pageSize: number;
}

export interface GallerySettingsInput {
  title: string;
  expiresAt: string | null;
  includedCount: number;
  extraPrice: number;
  currency: Currency;
}

export interface RestoreGalleryInput {
  id: string;
  expiresAt: string | null | undefined;
}

export interface DeleteGalleryInput {
  id: string;
  confirmTitle: string;
}

export interface UpdateGalleryInput {
  id: string;
  settings: GallerySettingsInput;
}
