<script setup lang="ts">
import { useId } from 'vue';
import AppDialog from './AppDialog.vue';

const { title, submitLabel, pending, submitDisabled, error } = defineProps<{
  title: string;
  submitLabel: string;
  pending: boolean;
  submitDisabled?: boolean;
  error: string;
}>();

const emit = defineEmits<{ submit: []; close: [] }>();

const formId = useId();
</script>

<template>
  <AppDialog open :title="title" @close="emit('close')">
    <form
      :id="formId"
      class="form-dialog"
      novalidate
      @submit.prevent="emit('submit')"
    >
      <slot />
      <p v-if="error" class="notice notice--danger" role="alert">
        {{ error }}
      </p>
    </form>

    <template #actions>
      <button type="button" class="btn dialog__cancel" @click="emit('close')">
        Скасувати
      </button>
      <button
        type="submit"
        class="btn btn--primary"
        :form="formId"
        :disabled="pending || submitDisabled"
      >
        {{ submitLabel }}
      </button>
    </template>
  </AppDialog>
</template>
