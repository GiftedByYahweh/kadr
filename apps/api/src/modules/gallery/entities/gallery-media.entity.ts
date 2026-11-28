import type { MediaStatus } from '@kadr/shared';

export interface GalleryMedia {
  id: string;
  galleryId: string;
  originalName: string;
  storageKey: string;
  previewKey: string | null;
  status: MediaStatus;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  position: number;
  likedAt: Date | null;
  isCover: boolean;
  createdAt: Date;
}
