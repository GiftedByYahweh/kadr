<script setup lang="ts">
import { GALLERY_TRASH_RETENTION_DAYS } from '@kadr/shared';
import { AppEmptyState, AppTabs } from '@kadr/ui';
import { computed, ref } from 'vue';
import GalleryCard from '@/components/features/galleries/GalleryCard.vue';
import GalleryFormDialog from '@/components/features/galleries/GalleryFormDialog.vue';
import { useDebouncedRef } from '@/composables/useDebouncedRef.ts';
import {
  useGalleryCounts,
  useGalleryList,
} from '@/composables/useGalleryQueries.ts';

const SEARCH_DEBOUNCE_MS = 300;

const GalleryTab = {
  ACTIVE: 'active',
  TRASHED: 'trashed',
} as const;

const tab = ref<(typeof GalleryTab)[keyof typeof GalleryTab]>(
  GalleryTab.ACTIVE,
);
const isTrashTab = computed(() => tab.value === GalleryTab.TRASHED);
const search = ref('');
const debouncedSearch = useDebouncedRef(search, SEARCH_DEBOUNCE_MS);
const newGalleryOpen = ref(false);

const counts = useGalleryCounts();
const list = useGalleryList(isTrashTab, debouncedSearch);

const tabs = computed(() => [
  {
    value: GalleryTab.ACTIVE,
    label: 'Активні',
    count: counts.data.value?.active ?? null,
  },
  {
    value: GalleryTab.TRASHED,
    label: 'Кошик',
    count: counts.data.value?.trashed ?? null,
  },
]);

const galleries = computed(() => {
  const pages = list.data.value?.pages ?? [];
  return pages.flatMap((page) => page.items);
});

const isSearching = computed(() => debouncedSearch.value.trim() !== '');
const isEmpty = computed(
  () => list.isSuccess.value && galleries.value.length === 0,
);
const emptyState = computed(() => {
  if (isSearching.value) {
    return {
      title: 'Нічого не знайдено',
      text: `Немає галерей з назвою «${debouncedSearch.value.trim()}»`,
      canCreate: false,
    };
  }
  if (isTrashTab.value) {
    return {
      title: 'Кошик порожній',
      text: `Галереї з кошика видаляються назавжди через ${String(GALLERY_TRASH_RETENTION_DAYS)} днів`,
      canCreate: false,
    };
  }
  return {
    title: 'Ще немає жодної галереї',
    text: 'Створіть галерею для зйомки, завантажте фото й надішліть клієнту посилання. Клієнт обере фото, а ви побачите його вибір тут.',
    canCreate: true,
  };
});
</script>

<template>
  <section class="galleries">
    <h1 class="visually-hidden">Галереї</h1>

    <AppTabs v-model="tab" label="Статус галерей" :items="tabs">
      <template #aside>
        <div class="galleries__tools">
          <label class="galleries__search">
            <span class="icon icon--s icon--search" />
            <span class="visually-hidden">Пошук галерей</span>
            <input
              v-model="search"
              class="galleries__search-input"
              type="search"
              placeholder="Пошук за назвою"
            />
          </label>
          <button
            type="button"
            class="btn btn--primary btn--icon"
            aria-label="Нова галерея"
            title="Нова галерея"
            @click="newGalleryOpen = true"
          >
            <span class="icon icon--s icon--plus" />
          </button>
        </div>
      </template>

      <p v-if="list.isError.value" class="notice notice--danger" role="alert">
        {{ list.error.value?.message }}
      </p>

      <AppEmptyState
        v-else-if="isEmpty"
        icon="icon--image"
        :title="emptyState.title"
        :text="emptyState.text"
      >
        <button
          v-if="emptyState.canCreate"
          type="button"
          class="btn btn--primary"
          @click="newGalleryOpen = true"
        >
          Створити першу галерею
        </button>
      </AppEmptyState>

      <template v-else>
        <div class="galleries__grid">
          <GalleryCard
            v-for="gallery in galleries"
            :key="gallery.id"
            :gallery="gallery"
          />
        </div>
        <button
          v-if="list.hasNextPage.value"
          type="button"
          class="btn galleries__more"
          :disabled="list.isFetchingNextPage.value"
          @click="list.fetchNextPage()"
        >
          Показати ще
        </button>
      </template>
    </AppTabs>

    <GalleryFormDialog v-if="newGalleryOpen" @close="newGalleryOpen = false" />
  </section>
</template>

<style scoped>
.galleries {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.galleries__tools {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.galleries__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--control-height);
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
}

.galleries__search:focus-within {
  border-color: var(--color-accent);
}

.galleries__search-input {
  width: 200px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
}

.galleries__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-6) var(--space-5);
}

.galleries__more {
  align-self: center;
  margin-top: var(--space-6);
}
</style>
