<script setup lang="ts" generic="T extends string">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui';

const { items, label } = defineProps<{
  items: { value: T; label: string; count: number | null }[];
  label: string;
}>();

const model = defineModel<T>({ required: true });

function select(value: string | number) {
  const item = items.find((candidate) => candidate.value === value);
  if (item) model.value = item.value;
}
</script>

<template>
  <TabsRoot class="tabs" :model-value="model" @update:model-value="select">
    <div class="tabs__header">
      <TabsList class="tabs__list" :aria-label="label">
        <TabsTrigger
          v-for="item in items"
          :key="item.value"
          class="tabs__trigger"
          :value="item.value"
        >
          {{ item.label }}
          <span v-if="item.count !== null" class="tabs__count">
            {{ item.count }}
          </span>
        </TabsTrigger>
      </TabsList>
      <slot name="aside" />
    </div>
    <TabsContent class="tabs__content" :value="model">
      <slot />
    </TabsContent>
  </TabsRoot>
</template>
