import type { ClientGalleryMediaDto } from '@kadr/shared';
import { computed, ref } from 'vue';
import { useGallery } from './useGallery.ts';

const items = ref<ClientGalleryMediaDto[]>([]);
const index = ref<number | null>(null);
const commentsOpen = ref(false);

const { visibleMedia } = useGallery();

const current = computed(() =>
  index.value === null ? null : (items.value[index.value] ?? null),
);

function open(mediaId: string) {
  items.value = [...visibleMedia.value];
  index.value = items.value.findIndex((item) => item.id === mediaId);
}

function change(nextIndex: number) {
  index.value = nextIndex;
}

function close() {
  index.value = null;
  commentsOpen.value = false;
}

function toggleComments() {
  commentsOpen.value = !commentsOpen.value;
}

export function useViewer() {
  return {
    items,
    index,
    current,
    commentsOpen,
    open,
    change,
    close,
    toggleComments,
  };
}
