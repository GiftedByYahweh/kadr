<script setup lang="ts">
import type { AdminGalleryDto } from '@kadr/shared';
import { AppAlertDialog, AppTextField } from '@kadr/ui';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGalleryMutation } from '@/composables/useGalleryQueries.ts';
import { RouteName } from '@/router/route-names.ts';
import { galleriesService } from '@/services/galleries.service.ts';

const { gallery } = defineProps<{ gallery: AdminGalleryDto }>();
const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const typedTitle = ref('');
const remove = useGalleryMutation(galleriesService.delete);

const titleMatches = computed(() => typedTitle.value.trim() === gallery.title);
const description = `Галерею, ${String(gallery.mediaCount)} файлів, вибір і коментарі клієнта буде видалено одразу. Відновити не вийде.`;

function confirm() {
  if (!titleMatches.value) return;
  remove.mutate(
    { id: gallery.id, confirmTitle: gallery.title },
    {
      onSuccess: () => {
        emit('close');
        void router.replace({ name: RouteName.GALLERIES });
      },
    },
  );
}
</script>

<template>
  <AppAlertDialog
    :title="`Видалити «${gallery.title}» назавжди?`"
    :description="description"
    confirm-label="Видалити назавжди"
    danger
    :pending="remove.isPending.value"
    :confirm-disabled="!titleMatches"
    @confirm="confirm"
    @close="emit('close')"
  >
    <AppTextField
      id="delete-gallery-title"
      v-model="typedTitle"
      label="Введіть назву галереї, щоб підтвердити"
      :placeholder="gallery.title"
    />
    <p v-if="remove.error.value" class="notice notice--danger" role="alert">
      {{ remove.error.value.message }}
    </p>
  </AppAlertDialog>
</template>
