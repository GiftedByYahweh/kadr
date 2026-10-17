<script setup lang="ts">
import { GALLERY_COMMENT_MAX_LENGTH } from '@kadr/shared';
import { CommentsPanel, LikeButton, PhotoViewer } from '@kadr/ui';
import { computed } from 'vue';
import { useGallery } from '../../composables/useGallery.ts';
import { useViewer } from '../../composables/useViewer.ts';

const { toggleLike, addComment } = useGallery();
const { items, index, current, commentsOpen, change, close, toggleComments } =
  useViewer();

const viewerItems = computed(() =>
  items.value.map((item) => ({
    id: item.id,
    src: item.previewUrl,
    width: item.width,
    height: item.height,
    alt: item.originalName,
  })),
);
</script>

<template>
  <PhotoViewer
    :items="viewerItems"
    :index="index"
    :panel-open="commentsOpen"
    @change="change"
    @close="close"
  >
    <template v-if="current" #actions>
      <button
        class="icon-button"
        :class="{ 'icon-button--active': commentsOpen }"
        :aria-pressed="commentsOpen"
        aria-label="Коментарі"
        @click="toggleComments"
      >
        <span class="icon icon--comment" />
        <span v-if="current.comments.length" class="icon-button__badge">
          {{ current.comments.length }}
        </span>
      </button>
      <LikeButton
        :liked="current.likedAt !== null"
        @toggle="toggleLike(current.id)"
      />
    </template>
    <template v-if="current && index !== null" #footer>
      <span class="text-upper"> {{ index + 1 }} / {{ items.length }} </span>
    </template>
    <template v-if="current && commentsOpen" #panel>
      <CommentsPanel
        :comments="current.comments"
        :max-length="GALLERY_COMMENT_MAX_LENGTH"
        @add="addComment(current.id, $event)"
        @close="toggleComments"
      />
    </template>
  </PhotoViewer>
</template>
