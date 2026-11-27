<script setup lang="ts">
import { Currency, type AdminGalleryDto } from '@kadr/shared';
import { AppFormDialog, AppSelect, AppTextField } from '@kadr/ui';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGalleryForm } from '@/modules/gallery/composables/useGalleryForm.ts';
import { useGalleryMutation } from '@/modules/gallery/composables/useGalleryQueries.ts';
import { RouteName } from '@/router/route-names.ts';
import { galleriesService } from '@/modules/gallery/services/galleries.service.ts';
import type { GallerySettingsInput } from '@/modules/gallery/services/galleries.types.ts';
import AccessTermField from './AccessTermField.vue';
import {
  accessTermOf,
  defaultAccessTerm,
} from '@/modules/gallery/domain/gallery-access.ts';

const ID_PREFIX = 'gallery-form';

const CURRENCY_OPTIONS = [
  { value: Currency.UAH, label: '₴ UAH' },
  { value: Currency.EUR, label: '€ EUR' },
  { value: Currency.USD, label: '$ USD' },
];

const { gallery = null } = defineProps<{ gallery?: AdminGalleryDto | null }>();
const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const isEditing = gallery !== null;

const form = useGalleryForm({
  title: gallery?.title ?? '',
  includedCount: gallery ? String(gallery.includedCount) : '',
  extraPrice: gallery ? String(gallery.extraPrice) : '',
  currency: gallery?.currency ?? Currency.UAH,
  access: gallery ? accessTermOf(gallery.expiresAt) : defaultAccessTerm(),
});

const create = useGalleryMutation(galleriesService.create);
const update = useGalleryMutation(galleriesService.update);

const pending = computed(
  () => create.isPending.value || update.isPending.value,
);
const error = computed(
  () => create.error.value?.message ?? update.error.value?.message ?? '',
);

function save(settings: GallerySettingsInput) {
  if (gallery) {
    update.mutate(
      { id: gallery.id, settings },
      {
        onSuccess: () => {
          emit('close');
        },
      },
    );
    return;
  }
  create.mutate(settings, {
    onSuccess: (created) => {
      emit('close');
      void router.push({ name: RouteName.GALLERY, params: { id: created.id } });
    },
  });
}

function submit() {
  const settings = form.toInput();
  if (settings) save(settings);
}
</script>

<template>
  <AppFormDialog
    :title="isEditing ? 'Налаштування галереї' : 'Нова галерея'"
    :submit-label="isEditing ? 'Зберегти' : 'Створити'"
    :pending="pending"
    :error="error"
    @submit="submit"
    @close="emit('close')"
  >
    <AppTextField
      :id="`${ID_PREFIX}-title`"
      v-model="form.values.title"
      label="Назва"
      placeholder="Весілля Олени й Андрія"
      hint="Великий заголовок на обкладинці галереї"
      :error="form.errors.value.title"
    />
    <div class="gallery-form__row">
      <AppTextField
        :id="`${ID_PREFIX}-included`"
        v-model="form.values.includedCount"
        label="Фото в пакеті"
        placeholder="30"
        input-mode="numeric"
        :error="form.errors.value.includedCount"
      />
      <AppTextField
        :id="`${ID_PREFIX}-price`"
        v-model="form.values.extraPrice"
        label="Доплата"
        placeholder="150"
        input-mode="numeric"
        :error="form.errors.value.extraPrice"
      />
      <AppSelect
        :id="`${ID_PREFIX}-currency`"
        v-model="form.values.currency"
        label="Валюта"
        :items="CURRENCY_OPTIONS"
      />
    </div>
    <p class="gallery-form__note text-secondary">
      Клієнт бачить лічильник «обрано / в пакеті»; кожне фото понад пакет додає
      доплату
    </p>
    <AccessTermField
      v-model="form.values.access"
      :id-prefix="ID_PREFIX"
      :error="form.errors.value.access"
    />
  </AppFormDialog>
</template>

<style scoped>
.gallery-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--space-4);
}

.gallery-form__note {
  font-size: var(--font-size-s);
}
</style>
