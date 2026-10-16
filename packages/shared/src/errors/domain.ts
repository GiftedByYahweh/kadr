export const DomainErrorCode = {
  GALLERY_NOT_FOUND: 1001,
  GALLERY_EXPIRED: 1002,
  GALLERY_MEDIA_NOT_FOUND: 1003,
} as const;

export type DomainErrorCode =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
