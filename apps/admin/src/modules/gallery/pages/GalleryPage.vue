<script setup lang="ts">
import { AppEmptyState } from '@kadr/ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ActiveGallery from '@/modules/gallery/components/ActiveGallery.vue';
import TrashedGallery from '@/modules/gallery/components/TrashedGallery.vue';
import { useGallery } from '@/modules/gallery/composables/useGalleryQueries.ts';
import { RouteName } from '@/router/route-names.ts';

const route = useRoute();
const galleryId = computed(() => String(route.params['id']));
const gallery = useGallery(galleryId);
</script>

<template>
  <section class="gallery-page">
    <template v-if="gallery.data.value">
      <TrashedGallery
        v-if="gallery.data.value.trashedAt !== null"
        :gallery="gallery.data.value"
      />
      <ActiveGallery v-else :gallery="gallery.data.value" />
    </template>

    <AppEmptyState
      v-else-if="gallery.isError.value"
      :title="gallery.error.value?.message ?? ''"
    >
      <RouterLink
        :to="{ name: RouteName.GALLERIES }"
        class="text-secondary text-hover"
      >
        ← Галереї
      </RouterLink>
    </AppEmptyState>
  </section>
</template>
