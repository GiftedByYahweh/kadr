<script setup lang="ts">
const {
  title,
  text = '',
  icon = '',
} = defineProps<{
  title: string;
  text?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="empty-state">
    <span v-if="icon" class="icon" :class="icon" />
    <span class="empty-state__title">{{ title }}</span>
    <span v-if="text" class="empty-state__text">{{ text }}</span>
    <slot />
  </div>
</template>
