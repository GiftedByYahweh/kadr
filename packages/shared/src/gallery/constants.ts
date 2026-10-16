export const GalleryStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  TRASHED: 'trashed',
} as const;

export type GalleryStatus = (typeof GalleryStatus)[keyof typeof GalleryStatus];

export const GalleryMediaStatus = {
  UPLOADING: 'uploading',
  READY: 'ready',
  FAILED: 'failed',
} as const;

export type GalleryMediaStatus =
  (typeof GalleryMediaStatus)[keyof typeof GalleryMediaStatus];

export const GALLERY_COMMENT_MAX_LENGTH = 2000;
