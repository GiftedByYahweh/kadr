<script setup lang="ts">
import { formatPrice } from '@kadr/shared';
import { AppDialog } from '@kadr/ui';
import { useGallery } from '../../composables/useGallery.ts';

defineProps<{ open: boolean; title: string }>();

const emit = defineEmits<{ close: []; confirm: [] }>();

const { summary } = useGallery();
</script>

<template>
  <AppDialog :open="open" :title="title" @close="emit('close')">
    <dl v-if="summary" class="confirm-summary">
      <div class="confirm-summary__row">
        <dt class="text-muted">Обрано фото</dt>
        <dd>{{ summary.selectedCount }}</dd>
      </div>
      <div class="confirm-summary__row">
        <dt class="text-muted">У пакеті</dt>
        <dd>{{ summary.includedCount }}</dd>
      </div>
      <template v-if="summary.extraCount">
        <div class="confirm-summary__row">
          <dt class="text-muted">Додатково</dt>
          <dd>
            {{ summary.extraCount }} × {{ formatPrice(summary.extraPrice) }}
          </dd>
        </div>
        <div class="confirm-summary__row confirm-summary__row--total">
          <dt>До сплати</dt>
          <dd class="text-lead text-accent">
            {{ formatPrice(summary.extraTotal) }}
          </dd>
        </div>
      </template>
    </dl>
    <p class="confirm-note text-muted">
      Фотограф отримає ваш вибір. Змінити його можна й після підтвердження.
    </p>
    <template #actions>
      <button class="btn text-upper" @click="emit('close')">Скасувати</button>
      <button class="btn btn--primary text-upper" @click="emit('confirm')">
        Підтвердити
      </button>
    </template>
  </AppDialog>
</template>

<style scoped>
.confirm-summary {
  display: grid;
  gap: var(--space-3);
}

.confirm-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-4);
}

.confirm-summary__row--total {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-muted);
}

.confirm-note {
  font-size: var(--font-size-s);
}
</style>
