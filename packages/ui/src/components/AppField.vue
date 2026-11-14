<script setup lang="ts">
import { computed } from 'vue';

const {
  id,
  label,
  hint = '',
  error = '',
} = defineProps<{
  id: string;
  label: string;
  hint?: string;
  error?: string;
}>();

const messageId = computed(() => `${id}-message`);
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label class="field__label" :for="id">{{ label }}</label>
    <slot :message-id="messageId" :invalid="Boolean(error)" />
    <span v-if="error" :id="messageId" class="field__error" role="alert">
      {{ error }}
    </span>
    <span v-else-if="hint" :id="messageId" class="field__hint">{{ hint }}</span>
  </div>
</template>
