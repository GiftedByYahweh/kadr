<script setup lang="ts">
import { formatDate, type AdminGalleryListItemDto } from '@kadr/shared';
import { computed } from 'vue';
import { RouteName } from '@/router/route-names.ts';
import {
  accessText,
  deletionDate,
  gallerySelectionState,
  SELECTION_STATE_BADGES,
  SELECTION_STATE_LABELS,
  selectionText,
} from './gallery-display.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryListItemDto }>();

const now = new Date();
const isTrashed = gallery.trashedAt !== null;
const state = gallerySelectionState(gallery);

const line = computed(() => {
  if (gallery.trashedAt !== null) {
    return `Видалиться ${formatDate(deletionDate(gallery.trashedAt), now)}`;
  }
  const access = accessText(gallery, now).toLowerCase();
  return `${selectionText(gallery)} · ${access}`;
});
</script>

<template>
  <RouterLink
    :to="{ name: RouteName.GALLERY, params: { id: gallery.id } }"
    class="gallery-card"
  >
    <div
      class="gallery-card__cover"
      :class="{ 'gallery-card__cover--trashed': isTrashed }"
    >
      <img
        v-if="gallery.coverUrl"
        class="gallery-card__image"
        :src="gallery.coverUrl"
        alt=""
      />
      <span
        v-if="!isTrashed"
        class="badge gallery-card__badge"
        :class="SELECTION_STATE_BADGES[state]"
      >
        {{ SELECTION_STATE_LABELS[state] }}
      </span>
      <span class="gallery-card__count" title="Фото">
        <span class="icon icon--s icon--image" />
        {{ gallery.mediaCount }}
      </span>
    </div>
    <div class="gallery-card__info">
      <span class="gallery-card__title">{{ gallery.title }}</span>
      <span class="gallery-card__line text-secondary">{{ line }}</span>
    </div>
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

.gallery-card__cover--trashed {
  opacity: var(--disabled-dim);
}

.gallery-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card__badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
}

.gallery-card__count {
  position: absolute;
  bottom: var(--space-3);
  left: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  background: var(--color-overlay);
  color: var(--color-inverse-text);
  font-size: var(--font-size-s);
  font-weight: 600;
}

.gallery-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.gallery-card__title {
  font-size: var(--font-size-m);
  font-weight: 600;
  line-height: var(--line-height-tight);
  transition: color var(--duration-base) var(--ease);
}

.gallery-card__line {
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
