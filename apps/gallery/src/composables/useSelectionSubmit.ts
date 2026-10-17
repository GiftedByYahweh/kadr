import { computed, ref } from 'vue';
import { useGallery } from './useGallery.ts';

export const SubmitStatus = {
  EMPTY: 'empty',
  READY: 'ready',
  SENT: 'sent',
  CHANGED: 'changed',
} as const;

export type SubmitStatus = (typeof SubmitStatus)[keyof typeof SubmitStatus];

const submittedIds = ref<string[] | null>(null);

const { gallery, likedMedia } = useGallery();

const likedIds = computed(() => likedMedia.value.map((item) => item.id));

function isSameSelection(previous: string[], current: string[]) {
  const previousSet = new Set(previous);
  return (
    previous.length === current.length &&
    current.every((id) => previousSet.has(id))
  );
}

const status = computed<SubmitStatus>(() => {
  if (!likedIds.value.length) return SubmitStatus.EMPTY;
  if (!gallery.value?.selectionSubmittedAt) return SubmitStatus.READY;
  if (!submittedIds.value) return SubmitStatus.SENT;
  return isSameSelection(submittedIds.value, likedIds.value)
    ? SubmitStatus.SENT
    : SubmitStatus.CHANGED;
});

function submit() {
  if (!gallery.value) return;
  gallery.value.selectionSubmittedAt = new Date().toISOString();
  submittedIds.value = [...likedIds.value];
}

export function useSelectionSubmit() {
  return { status, submit };
}
