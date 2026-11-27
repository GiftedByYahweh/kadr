<script setup lang="ts">
import { formatDate } from '@kadr/shared';
import { AppSelect, AppTextField } from '@kadr/ui';
import { computed } from 'vue';
import {
  AccessTerm,
  ACCESS_TERMS,
  accessTermExpiry,
  toDateInput,
  type AccessTermValue,
} from './gallery-access.ts';

const { idPrefix, error = '' } = defineProps<{
  idPrefix: string;
  error?: string;
}>();

const value = defineModel<AccessTermValue>({ required: true });

const now = new Date();
const minDate = toDateInput(now);
const isCustom = computed(() => value.value.term === AccessTerm.CUSTOM);

const result = computed(() => {
  if (value.value.term === AccessTerm.UNLIMITED) {
    return 'Посилання працюватиме без терміну';
  }
  const expiresAt = accessTermExpiry(value.value, now);
  if (expiresAt === null) return '';
  return `Клієнт матиме доступ до ${formatDate(expiresAt, now)}`;
});
</script>

<template>
  <div class="access-term">
    <AppSelect
      :id="`${idPrefix}-term`"
      v-model="value.term"
      label="Доступ для клієнта"
      :items="ACCESS_TERMS"
    />
    <AppTextField
      v-if="isCustom"
      :id="`${idPrefix}-date`"
      v-model="value.customDate"
      label="Дата"
      type="date"
      :min="minDate"
      :error="error"
    />
    <p v-if="result" class="access-term__result text-secondary">
      {{ result }}
    </p>
  </div>
</template>

<style scoped>
.access-term {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.access-term__result {
  font-size: var(--font-size-s);
}
</style>
