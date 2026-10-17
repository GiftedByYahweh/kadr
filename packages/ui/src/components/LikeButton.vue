<script setup lang="ts">
defineProps<{ liked: boolean }>();

const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <button
    class="icon-button"
    :class="{ 'icon-button--active': liked }"
    :aria-pressed="liked"
    aria-label="Обрати фото"
    @click.stop="emit('toggle')"
  >
    <span
      class="icon"
      :class="liked ? 'icon--heart-filled icon--pop' : 'icon--heart'"
    />
  </button>
</template>
