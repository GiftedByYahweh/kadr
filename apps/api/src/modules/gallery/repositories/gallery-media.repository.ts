import type { GalleryMedia } from '../entities/gallery-media.entity.ts';

export interface CreateGalleryMediaData {
  id: string;
  galleryId: string;
  originalName: string;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
  position: number;
}

export interface GalleryMediaRepository {
  countInGallery(galleryId: string): Promise<number>;
  countUploadingByUser(userId: string): Promise<number>;
  findLastPosition(galleryId: string): Promise<number | null>;
  createUploading(data: CreateGalleryMediaData[]): Promise<void>;
  findInGallery(galleryId: string, ids: string[]): Promise<GalleryMedia[]>;
  markProcessing(ids: string[]): Promise<void>;
}
