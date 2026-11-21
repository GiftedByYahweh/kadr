export const DomainErrorCode = {
  GALLERY_NOT_FOUND: 1001,
  GALLERY_EXPIRED: 1002,
  GALLERY_MEDIA_NOT_FOUND: 1003,
  GALLERY_TRASHED: 1004,
  GALLERY_RESTORE_NEEDS_EXPIRY: 1005,
  GALLERY_TITLE_MISMATCH: 1006,
  GALLERY_EXPIRY_IN_PAST: 1007,

  // Auth
  INVALID_CREDENTIALS: 1101,
} as const;

export type DomainErrorCode =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
