<script setup lang="ts">
import { GalleryFilter, useGallery } from '../../composables/useGallery.ts';
import SelectionSummary from '../features/SelectionSummary.vue';
import SubmitSelectionButton from '../features/SubmitSelectionButton.vue';

const { filter, media, likedMedia, setFilter } = useGallery();
</script>

<template>
  <header class="toolbar">
    <div class="toolbar__content">
      <SelectionSummary class="toolbar__summary" />
      <nav class="toolbar__filters text-upper">
        <button
          class="toolbar__filter btn-text text-hover"
          :class="{ 'toolbar__filter--active': filter === GalleryFilter.ALL }"
          :aria-pressed="filter === GalleryFilter.ALL"
          @click="setFilter(GalleryFilter.ALL)"
        >
          усі
          <span class="toolbar__count">{{ media.length }}</span>
        </button>
        <button
          class="toolbar__filter btn-text text-hover"
          :class="{ 'toolbar__filter--active': filter === GalleryFilter.LIKED }"
          :aria-pressed="filter === GalleryFilter.LIKED"
          @click="setFilter(GalleryFilter.LIKED)"
        >
          обрані
          <span class="toolbar__count">{{ likedMedia.length }}</span>
          <span
            class="icon icon--s"
            :class="
              filter === GalleryFilter.LIKED
                ? 'icon--heart-filled text-accent'
                : 'icon--heart'
            "
          />
        </button>
      </nav>
      <a
        class="toolbar__download text-upper text-muted text-hover"
        aria-label="Завантажити всі фото"
      >
        <span class="toolbar__download-label">завантажити всі</span>
        <span class="icon icon--s icon--download" />
      </a>
      <SubmitSelectionButton class="toolbar__submit" />
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  backdrop-filter: blur(10px);
  background: var(--color-header-blur);
}

.toolbar__content {
  max-width: calc(var(--content-max-width-wide) + 2 * var(--page-padding));
  margin: 0 auto;
  padding: var(--space-3) var(--page-padding);
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.toolbar__filters {
  display: flex;
  gap: var(--space-5);
  margin-left: auto;
}

.toolbar__filter {
  padding-bottom: var(--space-1);
  border-bottom: 1px solid transparent;
  color: var(--color-text-muted);
}

.toolbar__filter--active {
  border-bottom-color: currentColor;
  color: var(--color-text);
}

.toolbar__count {
  font-size: var(--font-size-s);
}

.toolbar__download {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

@media (max-width: 800px) {
  .toolbar__content {
    padding: var(--space-3) var(--space-4);
    gap: var(--space-4);
  }

  .toolbar__summary,
  .toolbar__submit,
  .toolbar__download-label {
    display: none;
  }

  .toolbar__filters {
    margin-left: 0;
  }

  .toolbar__download {
    margin-left: auto;
  }
}
</style>
