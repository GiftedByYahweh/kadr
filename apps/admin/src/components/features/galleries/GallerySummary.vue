<script setup lang="ts">
import type { AdminGalleryDto } from '@kadr/shared';
import { computed } from 'vue';
import {
  gallerySelectionState,
  SELECTION_STATE_BADGES,
  SELECTION_STATE_LABELS,
  selectionText,
} from './gallery-display.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryDto }>();

const state = computed(() => gallerySelectionState(gallery));
</script>

<template>
  <div class="gallery-summary text-secondary">
    <span class="badge" :class="SELECTION_STATE_BADGES[state]">
      {{ SELECTION_STATE_LABELS[state] }}
    </span>
    <span class="gallery-summary__item" title="Фото">
      <span class="icon icon--s icon--image" />
      {{ gallery.mediaCount }}
    </span>
    <span class="gallery-summary__item" title="Обрано клієнтом">
      <span class="icon icon--s icon--heart" />
      {{ selectionText(gallery) }}
    </span>
  </div>
</template>

<style scoped>
.gallery-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--font-size-s);
}

.gallery-summary__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
