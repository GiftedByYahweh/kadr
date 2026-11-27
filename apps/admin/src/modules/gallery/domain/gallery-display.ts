import {
  formatDate,
  formatPrice,
  GALLERY_TRASH_RETENTION_DAYS,
  GallerySelectionState,
  selectionSummary,
  type AdminGalleryListItemDto,
} from '@kadr/shared';
import { isExpired } from './gallery-access.ts';

export const SELECTION_STATE_LABELS: Record<GallerySelectionState, string> = {
  [GallerySelectionState.NOT_STARTED]: 'Ще не обрано',
  [GallerySelectionState.SELECTING]: 'Обирає',
  [GallerySelectionState.SUBMITTED]: 'Вибір підтверджено',
};

export const SELECTION_STATE_BADGES: Record<GallerySelectionState, string> = {
  [GallerySelectionState.NOT_STARTED]: '',
  [GallerySelectionState.SELECTING]: 'badge--warning',
  [GallerySelectionState.SUBMITTED]: 'badge--success',
};

export function gallerySelectionState(
  gallery: AdminGalleryListItemDto,
): GallerySelectionState {
  if (gallery.selectionSubmittedAt !== null) {
    return GallerySelectionState.SUBMITTED;
  }
  if (gallery.likedCount > 0) return GallerySelectionState.SELECTING;
  return GallerySelectionState.NOT_STARTED;
}

export function selectionText(gallery: AdminGalleryListItemDto): string {
  const summary = selectionSummary(
    gallery.includedCount,
    gallery.extraPrice,
    gallery.likedCount,
  );
  const base = `Обрано ${String(summary.selectedCount)} з ${String(summary.includedCount)}`;
  if (summary.extraTotal === 0) return base;
  return `${base} · +${formatPrice(summary.extraTotal, gallery.currency)}`;
}

export function accessText(
  gallery: AdminGalleryListItemDto,
  now: Date,
): string {
  if (gallery.expiresAt === null) return 'Без терміну';
  const date = formatDate(gallery.expiresAt, now);
  const expired = isExpired(gallery.expiresAt, now);
  if (expired) return `Доступ закінчився ${date}`;
  return `Доступ до ${date}`;
}

export function deletionDate(trashedAt: string): Date {
  const date = new Date(trashedAt);
  date.setDate(date.getDate() + GALLERY_TRASH_RETENTION_DAYS);
  return date;
}

export function mediaCountText(count: number): string {
  return `${String(count)} фото`;
}
