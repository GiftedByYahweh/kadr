<script setup lang="ts">
import { LikeButton, PhotoCard } from '@kadr/ui';
import { useGallery } from '../../composables/useGallery.ts';
import { useViewer } from '../../composables/useViewer.ts';

const { visibleMedia, toggleLike } = useGallery();
const { open } = useViewer();
</script>

<template>
  <ul v-if="visibleMedia.length" class="grid">
    <li
      v-for="item in visibleMedia"
      :key="item.id"
      class="grid__item"
      :data-viewer-id="item.id"
      :style="{ '--ratio': item.width / item.height }"
    >
      <PhotoCard
        :src="item.previewUrl"
        :alt="item.originalName"
        :ratio="item.width / item.height"
        @click="open(item.id)"
      >
        <span
          v-if="item.comments.length"
          class="icon-button"
          :aria-label="`${item.comments.length} comments`"
        >
          <span class="icon icon--comment" />
          <span class="icon-button__badge">{{ item.comments.length }}</span>
        </span>
        <LikeButton
          :liked="item.likedAt !== null"
          @toggle="toggleLike(item.id)"
        />
      </PhotoCard>
    </li>
  </ul>
  <p v-else class="empty text-upper text-muted">nothing selected yet</p>
</template>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--grid-gap-dense);
}

.grid::after {
  content: '';
  flex-grow: 1000000;
}

.grid__item {
  flex: calc(var(--ratio) * 100) 1 calc(var(--ratio) * var(--photo-row-height));
}

.grid :deep(.photo-card__frame) {
  cursor: zoom-in;
}

.empty {
  display: grid;
  place-items: center;
  min-height: 50vh;
  background: var(--color-muted);
}
</style>
