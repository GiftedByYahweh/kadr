<script setup lang="ts">
import { formatDateTime } from '@kadr/shared';
import { ref } from 'vue';

export interface PanelComment {
  id: string;
  text: string;
  createdAt: string;
}

defineProps<{
  comments: PanelComment[];
  maxLength: number;
}>();

const emit = defineEmits<{ add: [text: string]; close: [] }>();

const draft = ref('');

function submit() {
  const text = draft.value.trim();
  if (!text) return;
  emit('add', text);
  draft.value = '';
}
</script>

<template>
  <aside class="comments-panel" aria-label="Comments">
    <header class="comments-panel__header">
      <span class="text-upper">comments</span>
      <button
        class="icon-button"
        aria-label="Close comments"
        @click="emit('close')"
      >
        <span class="icon icon--close" />
      </button>
    </header>
    <ul v-if="comments.length" class="comments-panel__list">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="comments-panel__item"
      >
        <p>{{ comment.text }}</p>
        <time class="comments-panel__meta" :datetime="comment.createdAt">
          {{ formatDateTime(comment.createdAt) }}
        </time>
      </li>
    </ul>
    <p v-else class="comments-panel__empty text-muted">No comments yet</p>
    <form class="comments-panel__form" @submit.prevent="submit">
      <input
        v-model="draft"
        class="comments-panel__input"
        placeholder="Comment…"
        aria-label="Comment"
        :maxlength="maxLength"
      />
      <button
        class="icon-button"
        type="submit"
        aria-label="Send comment"
        :disabled="!draft.trim()"
      >
        <span class="icon icon--send" />
      </button>
    </form>
  </aside>
</template>
