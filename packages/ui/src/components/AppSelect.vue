<script setup lang="ts" generic="T extends string">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import AppField from './AppField.vue';

const {
  id,
  label,
  items,
  hint = '',
  error = '',
} = defineProps<{
  id: string;
  label: string;
  items: { value: T; label: string }[];
  hint?: string;
  error?: string;
}>();

const model = defineModel<T>({ required: true });

function select(value: unknown) {
  const item = items.find((candidate) => candidate.value === value);
  if (item) model.value = item.value;
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
    <div>
      <SelectRoot :model-value="model" @update:model-value="select">
        <SelectTrigger
          :id="id"
          class="field__control select__trigger"
          :aria-invalid="error !== ''"
          :aria-describedby="messageId"
        >
          <SelectValue />
          <SelectIcon class="icon icon--s icon--chevron-down" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent
            class="select"
            position="popper"
            :side-offset="4"
            :body-lock="false"
          >
            <SelectViewport>
              <SelectItem
                v-for="item in items"
                :key="item.value"
                class="select__item"
                :value="item.value"
              >
                <SelectItemText>{{ item.label }}</SelectItemText>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
  </AppField>
</template>
