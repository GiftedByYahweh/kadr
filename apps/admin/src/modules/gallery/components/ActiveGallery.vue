<script setup lang="ts">
import type { AdminGalleryDto } from '@kadr/shared';
import {
  AppAlertDialog,
  AppDropdownMenu,
  AppEmptyState,
  AppTabs,
} from '@kadr/ui';
import { computed, ref } from 'vue';
import DeleteGalleryDialog from './DeleteGalleryDialog.vue';
import GalleryFormDialog from './GalleryFormDialog.vue';
import GalleryHeader from './GalleryHeader.vue';
import GallerySummary from './GallerySummary.vue';
import {
  GALLERY_ACTIONS,
  GalleryAction,
} from '@/modules/gallery/domain/gallery-actions.ts';
import { accessText } from '@/modules/gallery/domain/gallery-display.ts';
import { useCopyText } from '@/shared/composables/useCopyText.ts';
import { useGalleryMutation } from '@/modules/gallery/composables/useGalleryQueries.ts';
import { galleriesService } from '@/modules/gallery/services/galleries.service.ts';

const MediaFilter = {
  ALL: 'all',
  LIKED: 'liked',
} as const;

const MEDIA_FILTERS = [
  { value: MediaFilter.ALL, label: 'Усі', count: null },
  { value: MediaFilter.LIKED, label: 'Обрані', count: null },
];

const { gallery } = defineProps<{ gallery: AdminGalleryDto }>();

const filter = ref<(typeof MediaFilter)[keyof typeof MediaFilter]>(
  MediaFilter.ALL,
);
const settingsOpen = ref(false);
const regenerateOpen = ref(false);
const deleteOpen = ref(false);

const { copied, error: copyError, copy } = useCopyText();
const trash = useGalleryMutation(galleriesService.trash);
const regenerate = useGalleryMutation(galleriesService.regenerateShareToken);

const meta = computed(() => accessText(gallery, new Date()));
const copyLabel = computed(() =>
  copied.value ? 'Посилання скопійовано' : 'Скопіювати посилання',
);
const emptyText = computed(() =>
  filter.value === MediaFilter.LIKED
    ? 'Клієнт ще нічого не обрав'
    : 'Фото ще не завантажені',
);
const actionError = computed(
  () =>
    trash.error.value?.message ??
    regenerate.error.value?.message ??
    copyError.value,
);

function onAction(action: GalleryAction) {
  if (action === GalleryAction.SETTINGS) settingsOpen.value = true;
  if (action === GalleryAction.OPEN_AS_CLIENT) {
    window.open(gallery.shareUrl, '_blank', 'noopener');
  }
  if (action === GalleryAction.REGENERATE_LINK) regenerateOpen.value = true;
  if (action === GalleryAction.TRASH) trash.mutate(gallery.id);
  if (action === GalleryAction.DELETE) deleteOpen.value = true;
}

function confirmRegenerate() {
  regenerate.mutate(gallery.id, {
    onSettled: () => {
      regenerateOpen.value = false;
    },
  });
}
</script>

<template>
  <div class="active-gallery">
    <GalleryHeader :title="gallery.title" :meta="meta">
      <button
        type="button"
        class="btn btn--icon"
        aria-label="Додати файли"
        title="Додати файли"
        disabled
      >
        <span class="icon icon--s icon--plus" />
      </button>
      <button
        type="button"
        class="btn btn--icon"
        :class="{ 'btn--done': copied }"
        :aria-label="copyLabel"
        :title="copyLabel"
        @click="copy(gallery.shareUrl)"
      >
        <span class="icon icon--s icon--link" />
      </button>
      <AppDropdownMenu
        label="Налаштування галереї"
        icon="icon--sliders"
        :items="GALLERY_ACTIONS"
        @select="onAction"
      />
    </GalleryHeader>

    <p v-if="actionError" class="notice notice--danger" role="alert">
      {{ actionError }}
    </p>

    <GallerySummary :gallery="gallery" />

    <AppTabs v-model="filter" label="Фільтр медіа" :items="MEDIA_FILTERS">
      <AppEmptyState icon="icon--image" :title="emptyText" />
    </AppTabs>

    <GalleryFormDialog
      v-if="settingsOpen"
      :gallery="gallery"
      @close="settingsOpen = false"
    />
    <AppAlertDialog
      v-if="regenerateOpen"
      title="Перегенерувати посилання?"
      description="Старе посилання одразу перестане працювати. Вибір і коментарі клієнта збережуться."
      confirm-label="Перегенерувати"
      :pending="regenerate.isPending.value"
      @confirm="confirmRegenerate"
      @close="regenerateOpen = false"
    />
    <DeleteGalleryDialog
      v-if="deleteOpen"
      :gallery="gallery"
      @close="deleteOpen = false"
    />
  </div>
</template>

<style scoped>
.active-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
</style>
