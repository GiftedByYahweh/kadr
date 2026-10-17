<script setup lang="ts">
import { ref } from 'vue';
import {
  SubmitStatus,
  useSelectionSubmit,
} from '../../composables/useSelectionSubmit.ts';
import ConfirmSelectionDialog from './ConfirmSelectionDialog.vue';

const LABELS: Record<SubmitStatus, string> = {
  [SubmitStatus.EMPTY]: 'підтвердити вибір',
  [SubmitStatus.READY]: 'підтвердити вибір',
  [SubmitStatus.SENT]: 'підтверджено',
  [SubmitStatus.CHANGED]: 'підтвердити зміни',
};

const { status, submit } = useSelectionSubmit();

const dialogOpen = ref(false);

function confirm() {
  submit();
  dialogOpen.value = false;
}
</script>

<template>
  <span class="submit-selection">
    <button
      class="btn text-upper"
      :class="{ 'btn--primary': status !== SubmitStatus.SENT }"
      :disabled="status === SubmitStatus.EMPTY || status === SubmitStatus.SENT"
      @click="dialogOpen = true"
    >
      {{ LABELS[status] }}
      <span
        v-if="status === SubmitStatus.SENT"
        class="icon icon--s icon--check"
      />
    </button>
    <ConfirmSelectionDialog
      :open="dialogOpen"
      :title="
        status === SubmitStatus.CHANGED
          ? 'Підтвердити зміни?'
          : 'Підтвердити вибір?'
      "
      @close="dialogOpen = false"
      @confirm="confirm"
    />
  </span>
</template>

<style scoped>
.submit-selection {
  display: contents;
}
</style>
