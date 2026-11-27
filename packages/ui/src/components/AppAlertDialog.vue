<script setup lang="ts">
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui';

const { title, description, confirmLabel, danger, pending, confirmDisabled } =
  defineProps<{
    title: string;
    description: string;
    confirmLabel: string;
    danger?: boolean;
    pending?: boolean;
    confirmDisabled?: boolean;
  }>();

const emit = defineEmits<{ confirm: []; close: [] }>();

function onOpenChange(isOpen: boolean) {
  if (!isOpen) emit('close');
}
</script>

<template>
  <AlertDialogRoot open @update:open="onOpenChange">
    <AlertDialogPortal>
      <AlertDialogOverlay class="alert-dialog__overlay" />
      <AlertDialogContent
        as="form"
        class="alert-dialog"
        novalidate
        @submit.prevent="emit('confirm')"
      >
        <AlertDialogTitle class="alert-dialog__title">
          {{ title }}
        </AlertDialogTitle>
        <AlertDialogDescription class="alert-dialog__description">
          {{ description }}
        </AlertDialogDescription>
        <slot />
        <div class="dialog__actions">
          <AlertDialogCancel class="btn dialog__cancel"
            >Скасувати</AlertDialogCancel
          >
          <button
            type="submit"
            class="btn"
            :class="danger ? 'btn--danger' : 'btn--primary'"
            :disabled="pending || confirmDisabled"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
