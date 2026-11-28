export const MEDIA_UPLOAD_START_RATE_LIMIT = {
  max: 30,
  timeWindow: '1 minute',
} as const;

export const MEDIA_UPLOAD_CONFIRM_RATE_LIMIT = {
  max: 300,
  timeWindow: '1 minute',
} as const;
