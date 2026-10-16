import { selectionSummary, type ClientGalleryDto } from '@kadr/shared';
import { computed, ref } from 'vue';
import { fetchGallery } from '../services/gallery.service.ts';

export const GalleryFilter = {
  ALL: 'all',
  LIKED: 'liked',
} as const;

export type GalleryFilter = (typeof GalleryFilter)[keyof typeof GalleryFilter];

const gallery = ref<ClientGalleryDto | null>(null);
const filter = ref<GalleryFilter>(GalleryFilter.ALL);

const media = computed(() => gallery.value?.media ?? []);
const likedMedia = computed(() =>
  media.value.filter((item) => item.likedAt !== null),
);
const visibleMedia = computed(() =>
  filter.value === GalleryFilter.LIKED ? likedMedia.value : media.value,
);
const summary = computed(() =>
  gallery.value
    ? selectionSummary(
        gallery.value.includedCount,
        gallery.value.extraPrice,
        likedMedia.value.length,
      )
    : null,
);

async function load() {
  gallery.value = await fetchGallery();
}

function toggleLike(mediaId: string) {
  const item = media.value.find((candidate) => candidate.id === mediaId);
  if (!item) return;
  item.likedAt = item.likedAt ? null : new Date().toISOString();
}

function addComment(mediaId: string, text: string) {
  const item = media.value.find((candidate) => candidate.id === mediaId);
  item?.comments.push({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  });
}

function setFilter(next: GalleryFilter) {
  filter.value = next;
}

export function useGallery() {
  return {
    gallery,
    filter,
    visibleMedia,
    summary,
    load,
    toggleLike,
    addComment,
    setFilter,
  };
}
