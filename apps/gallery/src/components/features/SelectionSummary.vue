<script setup lang="ts">
import { formatPrice } from '@kadr/shared';
import { useGallery } from '../../composables/useGallery.ts';

const { summary } = useGallery();
</script>

<template>
  <div v-if="summary" class="selection-summary">
    <span class="selection-summary__line">
      <span class="text-lead">{{ summary.selectedCount }}</span>
      <span class="text-upper text-muted">
        / {{ summary.includedCount }}
        <span class="selection-summary__label">у пакеті</span>
      </span>
    </span>
    <span v-if="summary.extraCount" class="text-upper text-accent">
      +{{ summary.extraCount }}
      <span class="selection-summary__label">додатково</span>
      · {{ formatPrice(summary.extraTotal) }}
    </span>
  </div>
</template>

<style scoped>
.selection-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-3);
  white-space: nowrap;
}

.selection-summary__line {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
}

@media (max-width: 800px) {
  .selection-summary__label {
    display: none;
  }
}
</style>
