<script setup lang="ts">
import type { AdminGalleryDto } from '@kadr/shared';
import { AppFormDialog } from '@kadr/ui';
import { computed, ref } from 'vue';
import { useGalleryMutation } from '@/modules/gallery/composables/useGalleryQueries.ts';
import { galleriesService } from '@/modules/gallery/services/galleries.service.ts';
import AccessTermField from './AccessTermField.vue';
import {
  accessTermExpiry,
  defaultAccessTerm,
  isAccessTermComplete,
} from '@/modules/gallery/domain/gallery-access.ts';
import { accessText } from '@/modules/gallery/domain/gallery-display.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryDto }>();
const emit = defineEmits<{ close: [] }>();

const term = ref(defaultAccessTerm());
const restore = useGalleryMutation(galleriesService.restore);

const isComplete = computed(() => isAccessTermComplete(term.value));
const access = accessText(gallery, new Date());

function submit() {
  if (!isComplete.value) return;
  const expiresAt = accessTermExpiry(term.value, new Date());
  restore.mutate(
    { id: gallery.id, expiresAt },
    {
      onSuccess: () => {
        emit('close');
      },
    },
  );
}
</script>

<template>
  <AppFormDialog
    :title="`Відновити «${gallery.title}»`"
    submit-label="Відновити доступ"
    :pending="restore.isPending.value"
    :submit-disabled="!isComplete"
    :error="restore.error.value?.message ?? ''"
    @submit="submit"
    @close="emit('close')"
  >
    <p class="text-secondary">
      {{ access }}. Щоб посилання знову запрацювало, вкажіть, до якої дати
      відкрити галерею.
    </p>
    <AccessTermField v-model="term" id-prefix="restore-gallery" />
  </AppFormDialog>
</template>
