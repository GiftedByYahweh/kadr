<script setup lang="ts">
import { formatDate, type AdminGalleryListItemDto } from '@kadr/shared';
import { computed } from 'vue';
import { RouteName } from '@/router/route-names.ts';
import {
  accessText,
  deletionDate,
  gallerySelectionState,
  mediaCountText,
  SELECTION_STATE_BADGES,
  SELECTION_STATE_LABELS,
  selectionText,
} from './gallery-display.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryListItemDto }>();

const now = new Date();

const access = computed(() =>
  gallery.trashedAt === null ? accessText(gallery, now) : 'Доступ вимкнено',
);

const badge = computed(() => {
  if (gallery.trashedAt !== null) {
    const date = formatDate(deletionDate(gallery.trashedAt), now);
    return { label: `Видалиться ${date}`, className: 'badge--muted' };
  }
  const state = gallerySelectionState(gallery);
  return {
    label: SELECTION_STATE_LABELS[state],
    className: SELECTION_STATE_BADGES[state],
  };
});
</script>

<template>
  <RouterLink
    :to="{ name: RouteName.GALLERY, params: { id: gallery.id } }"
    class="gallery-card"
  >
    <div class="gallery-card__cover">
      <img
        v-if="gallery.coverUrl"
        class="gallery-card__image"
        :src="gallery.coverUrl"
        alt=""
      />
      <span class="gallery-card__count text-upper">
        {{ mediaCountText(gallery.mediaCount) }}
      </span>
    </div>
    <span class="gallery-card__title">{{ gallery.title }}</span>
    <div class="gallery-card__status">
      <span class="badge" :class="badge.className">{{ badge.label }}</span>
      <span>{{ selectionText(gallery) }}</span>
    </div>
    <span class="gallery-card__access text-secondary">
      {{ access }}
    </span>
  </RouterLink>
</template>

<style scoped>
.gallery-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.gallery-card__cover {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--color-muted);
}

.gallery-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card__count {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  background: var(--color-overlay);
  color: var(--color-inverse-text);
  font-family: var(--font-family-base);
  font-size: var(--font-size-s);
}

.gallery-card__title {
  font-size: var(--font-size-lead);
  font-weight: 600;
  line-height: var(--line-height-tight);
  transition: color var(--duration-base) var(--ease);
}

.gallery-card__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.gallery-card__access {
  font-size: var(--font-size-s);
}

@media (hover: hover) and (pointer: fine) {
  .gallery-card:hover .gallery-card__title {
    color: var(--color-accent);
  }
}

.gallery-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: var(--space-1);
}
</style>
