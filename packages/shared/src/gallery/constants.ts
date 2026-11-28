export const GALLERY_COMMENT_MAX_LENGTH = 2000;

export const GALLERY_TITLE_MAX_LENGTH = 120;
export const GALLERY_INCLUDED_COUNT_MAX = 1000;
export const GALLERY_EXTRA_PRICE_MAX = 100_000;
export const GALLERY_LIST_PAGE_SIZE_MAX = 50;
export const GALLERY_MEDIA_MAX = 2000;
export const MEDIA_UPLOAD_BATCH_MAX = 50;
export const PENDING_UPLOADS_MAX = 500;
export const MEDIA_NAME_MAX_LENGTH = 255;

export const GallerySelectionState = {
  NOT_STARTED: 'not_started',
  SELECTING: 'selecting',
  SUBMITTED: 'submitted',
} as const;

export type GallerySelectionState =
  (typeof GallerySelectionState)[keyof typeof GallerySelectionState];

export const GALLERY_TRASH_RETENTION_DAYS = 30;
