<script setup lang="ts">
import { formatPrice } from '@kadr/shared';
import { GalleryFilter, useGallery } from '../../composables/useGallery.ts';

const { filter, summary, setFilter } = useGallery();

const filters = [
  { value: GalleryFilter.ALL, label: 'all' },
  { value: GalleryFilter.LIKED, label: 'selected ♥' },
];
</script>

<template>
  <header class="toolbar">
    <div class="toolbar__content">
      <div v-if="summary" class="toolbar__selection">
        <span class="text-lead">{{ summary.selectedCount }}</span>
        <span class="text-upper text-muted">
          / {{ summary.includedCount }} in package
        </span>
        <span v-if="summary.extraCount" class="text-upper text-accent">
          +{{ summary.extraCount }} extra ·
          {{ formatPrice(summary.extraTotal) }}
        </span>
      </div>
      <nav class="toolbar__filters text-upper">
        <button
          v-for="option in filters"
          :key="option.value"
          class="toolbar__filter btn-text text-hover"
          :class="{ 'toolbar__filter--active': filter === option.value }"
          :aria-pressed="filter === option.value"
          @click="setFilter(option.value)"
        >
          {{ option.label }}
        </button>
      </nav>
      <a class="text-upper text-muted text-hover">download all →</a>
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
  max-width: calc(var(--content-max-width) + 2 * var(--page-padding));
  margin: 0 auto;
  padding: var(--space-4) var(--page-padding);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3) var(--space-6);
}

.toolbar__selection {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-3);
}

.toolbar__filters {
  display: flex;
  gap: var(--space-5);
  margin-left: auto;
}

.toolbar__filter {
  color: var(--color-text-muted);
  text-underline-offset: var(--space-2);
}

.toolbar__filter--active {
  color: var(--color-text);
  text-decoration: underline;
}
</style>
