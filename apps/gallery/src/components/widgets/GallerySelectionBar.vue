<script setup lang="ts">
import { useGallery } from '../../composables/useGallery.ts';
import SelectionSummary from '../features/SelectionSummary.vue';
import SubmitSelectionButton from '../features/SubmitSelectionButton.vue';

const { likedMedia } = useGallery();
</script>

<template>
  <Transition name="selection-bar">
    <div v-if="likedMedia.length" class="selection-bar">
      <SelectionSummary class="selection-bar__summary" />
      <SubmitSelectionButton />
    </div>
  </Transition>
</template>

<style scoped>
.selection-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-header);
  min-height: var(--selection-bar-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4)
    calc(var(--space-3) + env(safe-area-inset-bottom));
  border-top: 1px solid var(--color-muted);
  backdrop-filter: blur(10px);
  background: var(--color-header-blur);
}

.selection-bar__summary {
  flex-direction: column;
  align-items: flex-start;
}

.selection-bar :deep(.btn) {
  padding-inline: var(--space-5);
}

.selection-bar-enter-active {
  transition:
    transform var(--duration-slow) var(--ease-out),
    opacity var(--duration-slow) var(--ease-out);
}

.selection-bar-leave-active {
  transition:
    transform var(--duration-base) var(--ease-out),
    opacity var(--duration-base) var(--ease-out);
}

.selection-bar-enter-from,
.selection-bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 801px) {
  .selection-bar {
    display: none;
  }
}
</style>
