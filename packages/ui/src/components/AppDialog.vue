<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';

const { open } = defineProps<{ open: boolean; title: string }>();

const emit = defineEmits<{ close: [] }>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');

watch(
  () => open,
  (isOpen) => {
    if (isOpen) dialog.value?.showModal();
    else dialog.value?.close();
  },
  { flush: 'post' },
);

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) emit('close');
}
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    :aria-label="title"
    @cancel.prevent="emit('close')"
    @click="onBackdropClick"
  >
    <div class="dialog__body">
      <header class="dialog__header">
        <h2 class="dialog__title text-upper">{{ title }}</h2>
        <button class="icon-button" aria-label="Закрити" @click="emit('close')">
          <span class="icon icon--close" />
        </button>
      </header>
      <slot />
      <footer v-if="$slots['actions']" class="dialog__actions">
        <slot name="actions" />
      </footer>
    </div>
  </dialog>
</template>
