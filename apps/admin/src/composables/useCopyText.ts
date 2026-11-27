import { onScopeDispose, ref } from 'vue';

const COPIED_RESET_MS = 2000;
const COPY_ERROR_MESSAGE = 'Не вдалося скопіювати. Скопіюйте вручну';

export function useCopyText() {
  const copied = ref(false);
  const error = ref('');
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      error.value = COPY_ERROR_MESSAGE;
      return;
    }
    error.value = '';
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copied.value = false;
    }, COPIED_RESET_MS);
  }

  onScopeDispose(() => {
    clearTimeout(resetTimer);
  });

  return { copied, error, copy };
}
