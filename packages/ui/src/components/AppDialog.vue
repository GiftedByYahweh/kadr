<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';

const { open, title } = defineProps<{ open: boolean; title: string }>();

const emit = defineEmits<{ close: [] }>();

function onOpenChange(isOpen: boolean) {
  if (!isOpen) emit('close');
}
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="dialog__overlay" />
      <DialogContent
        class="dialog"
        :aria-describedby="undefined"
        @interact-outside.prevent
      >
        <div class="dialog__body">
          <header class="dialog__header">
            <DialogTitle class="dialog__title text-upper">
              {{ title }}
            </DialogTitle>
            <DialogClose class="icon-button dialog__close" aria-label="Закрити">
              <span class="icon icon--close" />
            </DialogClose>
          </header>
          <slot />
          <footer v-if="$slots['actions']" class="dialog__actions">
            <slot name="actions" />
          </footer>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
