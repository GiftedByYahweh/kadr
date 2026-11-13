export const MediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const VIDEO_CONTENT_TYPES = ['video/mp4', 'video/quicktime'] as const;

export type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];
export type VideoContentType = (typeof VIDEO_CONTENT_TYPES)[number];
export type MediaContentType = ImageContentType | VideoContentType;
