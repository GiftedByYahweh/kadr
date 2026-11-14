export const RouteName = {
  LOGIN: 'login',
  GALLERIES: 'galleries',
  GALLERY: 'gallery',
} as const;

export type RouteName = (typeof RouteName)[keyof typeof RouteName];
