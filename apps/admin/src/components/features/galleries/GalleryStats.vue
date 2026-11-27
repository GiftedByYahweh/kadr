<script setup lang="ts">
import {
  formatDateTime,
  formatPrice,
  selectionSummary,
  type AdminGalleryListItemDto,
} from '@kadr/shared';
import { computed } from 'vue';
import { mediaCountText } from './gallery-display.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryListItemDto }>();

const stats = computed(() => {
  const summary = selectionSummary(
    gallery.includedCount,
    gallery.extraPrice,
    gallery.likedCount,
  );
  const submittedAt = gallery.selectionSubmittedAt;
  return [
    {
      label: 'Медіа',
      value: String(gallery.mediaCount),
      note: mediaCountText(gallery.mediaCount),
    },
    {
      label: 'Обрано клієнтом',
      value: `${String(summary.selectedCount)} з ${String(summary.includedCount)}`,
      note: `+${String(summary.extraCount)} понад пакет`,
    },
    {
      label: 'Доплата',
      value: formatPrice(summary.extraTotal, gallery.currency),
      note: `${String(summary.extraCount)} × ${formatPrice(summary.extraPrice, gallery.currency)}`,
    },
    {
      label: 'Вибір підтверджено',
      value: submittedAt ? formatDateTime(submittedAt) : 'Ще ні',
      note: submittedAt ? '' : 'Клієнт ще не надіслав вибір',
    },
  ];
});
</script>

<template>
  <dl class="gallery-stats">
    <div v-for="stat in stats" :key="stat.label" class="gallery-stats__item">
      <dt class="gallery-stats__label text-secondary">{{ stat.label }}</dt>
      <dd class="gallery-stats__value">{{ stat.value }}</dd>
      <dd v-if="stat.note" class="gallery-stats__note text-secondary">
        {{ stat.note }}
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.gallery-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.gallery-stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.gallery-stats__label,
.gallery-stats__note {
  font-size: var(--font-size-s);
}

.gallery-stats__value {
  font-size: var(--font-size-lead);
  font-weight: 700;
  line-height: var(--line-height-tight);
}
</style>
