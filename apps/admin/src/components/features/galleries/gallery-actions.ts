export const GalleryAction = {
  SETTINGS: 'settings',
  OPEN_AS_CLIENT: 'open-as-client',
  REGENERATE_LINK: 'regenerate-link',
  TRASH: 'trash',
  DELETE: 'delete',
} as const;

export type GalleryAction = (typeof GalleryAction)[keyof typeof GalleryAction];

export const GALLERY_ACTIONS = [
  {
    value: GalleryAction.SETTINGS,
    label: 'Налаштування',
    danger: false,
    separated: false,
  },
  {
    value: GalleryAction.OPEN_AS_CLIENT,
    label: 'Відкрити як клієнт',
    danger: false,
    separated: false,
  },
  {
    value: GalleryAction.REGENERATE_LINK,
    label: 'Перегенерувати посилання',
    danger: false,
    separated: false,
  },
  {
    value: GalleryAction.TRASH,
    label: 'Перенести в кошик',
    danger: false,
    separated: true,
  },
  {
    value: GalleryAction.DELETE,
    label: 'Видалити назавжди',
    danger: true,
    separated: false,
  },
];
