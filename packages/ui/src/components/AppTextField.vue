<script setup lang="ts">
import AppField from './AppField.vue';

const {
  id,
  label,
  hint = '',
  error = '',
  type = 'text',
  inputMode = 'text',
  placeholder = '',
  min = '',
} = defineProps<{
  id: string;
  label: string;
  hint?: string;
  error?: string;
  type?: 'text' | 'date';
  inputMode?: 'text' | 'numeric';
  placeholder?: string;
  min?: string;
}>();

const NON_DIGITS = /\D/g;

const model = defineModel<string>({ required: true });

function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const isNumeric = inputMode === 'numeric';
  const value = isNumeric ? input.value.replace(NON_DIGITS, '') : input.value;
  input.value = value;
  model.value = value;
}
</script>

<template>
  <AppField
    :id="id"
    v-slot="{ messageId }"
    :label="label"
    :hint="hint"
    :error="error"
  >
    <input
      :id="id"
      :value="model"
      class="field__control"
      autocomplete="off"
      :type="type"
      :inputmode="inputMode"
      :placeholder="placeholder"
      :min="min || undefined"
      :aria-invalid="error !== ''"
      :aria-describedby="messageId"
      @input="onInput"
    />
  </AppField>
</template>
