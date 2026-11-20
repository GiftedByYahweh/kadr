export const GalleryStatus = {
  ACTIVE: 'active',
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

export const GALLERY_TITLE_MAX_LENGTH = 120;
export const GALLERY_INCLUDED_COUNT_MAX = 1000;
export const GALLERY_EXTRA_PRICE_MAX = 100_000;
export const GALLERY_LIST_PAGE_SIZE_MAX = 50;
