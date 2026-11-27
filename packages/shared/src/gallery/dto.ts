import type { Currency } from './types.ts';

export interface ClientGalleryCommentDto {
  id: string;
  text: string;
  createdAt: string;
}

export interface ClientGalleryMediaDto {
  id: string;
  originalName: string;
  previewUrl: string;
  width: number;
  height: number;
  likedAt: string | null;
  comments: ClientGalleryCommentDto[];
}

export interface ClientGalleryDto {
  title: string;
  subtitle: string;
  coverUrl: string;
  includedCount: number;
  extraPrice: number;
  selectionSubmittedAt: string | null;
  media: ClientGalleryMediaDto[];
}

export interface AdminGalleryListItemDto {
  id: string;
  title: string;
  expiresAt: string | null;
  trashedAt: string | null;
  createdAt: string;
  includedCount: number;
  extraPrice: number;
  currency: Currency;
  selectionSubmittedAt: string | null;
  mediaCount: number;
  likedCount: number;
  coverUrl: string | null;
}

export interface AdminGalleryDto extends AdminGalleryListItemDto {
  shareUrl: string;
}

export interface AdminGalleryListPageDto {
  items: AdminGalleryListItemDto[];
  hasNextPage: boolean;
}

export interface AdminGalleryCountsDto {
  active: number;
  trashed: number;
}
