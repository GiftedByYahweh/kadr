<script setup lang="ts">
import { formatDate, type AdminGalleryDto } from '@kadr/shared';
import { computed, ref } from 'vue';
import DeleteGalleryDialog from '@/components/features/galleries/DeleteGalleryDialog.vue';
import GalleryHeader from '@/components/features/galleries/GalleryHeader.vue';
import GalleryStats from '@/components/features/galleries/GalleryStats.vue';
import RestoreGalleryDialog from '@/components/features/galleries/RestoreGalleryDialog.vue';
import { isExpired } from '@/components/features/galleries/gallery-access.ts';
import {
  accessText,
  deletionDate,
} from '@/components/features/galleries/gallery-display.ts';
import { useGalleryMutation } from '@/composables/useGalleryQueries.ts';
import { galleriesService } from '@/services/galleries.service.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryDto }>();

const restoreOpen = ref(false);
const deleteOpen = ref(false);
const restore = useGalleryMutation(galleriesService.restore);

const now = new Date();

const meta = computed(() => {
  const access = accessText(gallery, now);
  if (gallery.trashedAt === null) return access;
  return `${access} · у кошику з ${formatDate(gallery.trashedAt, now)}`;
});

const deletesOn = computed(() =>
  gallery.trashedAt ? formatDate(deletionDate(gallery.trashedAt), now) : '',
);

function startRestore() {
  const expired = isExpired(gallery.expiresAt, now);
  if (expired) {
    restoreOpen.value = true;
    return;
  }
  restore.mutate({ id: gallery.id, expiresAt: undefined });
}
</script>

<template>
  <div class="trashed-gallery">
    <GalleryHeader
      :title="gallery.title"
      badge="У кошику"
      badge-class="badge--muted"
      :meta="meta"
    >
      <button
        type="button"
        class="btn btn--primary"
        :disabled="restore.isPending.value"
        @click="startRestore"
      >
        Відновити доступ
      </button>
      <button
        type="button"
        class="btn trashed-gallery__delete"
        @click="deleteOpen = true"
      >
        <span class="icon icon--s icon--trash" />
        Видалити назавжди
      </button>
    </GalleryHeader>

    <p v-if="restore.error.value" class="notice notice--danger" role="alert">
      {{ restore.error.value.message }}
    </p>

    <p class="notice trashed-gallery__notice" role="status">
      <span class="icon icon--s icon--lock" />
      <span>
        Посилання для клієнта вимкнене. <strong>{{ deletesOn }}</strong>
        галерею й усі файли буде видалено назавжди. До того її можна відновити —
        клієнт побачить усе як раніше.
      </span>
    </p>

    <GalleryStats :gallery="gallery" />

    <RestoreGalleryDialog
      v-if="restoreOpen"
      :gallery="gallery"
      @close="restoreOpen = false"
    />
    <DeleteGalleryDialog
      v-if="deleteOpen"
      :gallery="gallery"
      @close="deleteOpen = false"
    />
  </div>
</template>

<style scoped>
.trashed-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.trashed-gallery__delete {
  border-color: var(--color-border);
  color: var(--color-danger);
}

.trashed-gallery__notice {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  background: var(--color-surface);
}

.trashed-gallery__notice .icon {
  margin-top: var(--space-1);
}
</style>
