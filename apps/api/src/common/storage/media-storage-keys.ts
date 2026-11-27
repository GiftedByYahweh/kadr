export const MediaArea = {
  GALLERIES: 'galleries',
  PORTFOLIO: 'portfolio',
} as const;

export type MediaArea = (typeof MediaArea)[keyof typeof MediaArea];

const USERS_FOLDER = 'users';
const ORIGINALS_FOLDER = 'originals';
const PREVIEWS_FOLDER = 'previews';
const PREVIEW_EXTENSION = 'webp';

export const mediaStorageKeys = {
  areaPrefix(userId: string, area: MediaArea, areaId: string) {
    return `${USERS_FOLDER}/${userId}/${area}/${areaId}/`;
  },

  original(areaPrefix: string, mediaId: string, extension: string) {
    return `${areaPrefix}${ORIGINALS_FOLDER}/${mediaId}.${extension}`;
  },

  preview(areaPrefix: string, mediaId: string) {
    return `${areaPrefix}${PREVIEWS_FOLDER}/${mediaId}.${PREVIEW_EXTENSION}`;
  },
};
