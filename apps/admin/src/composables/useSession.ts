import type { CurrentUserDto } from '@kadr/shared';
import { readonly, ref } from 'vue';
import { authService } from '@/services/auth.service.ts';

const currentUser = ref<CurrentUserDto | null>(null);
let sessionRequest: Promise<void> | null = null;

async function fetchSession(): Promise<void> {
  currentUser.value = await authService.fetchCurrentUser();
}

export function useSession() {
  function ensureLoaded(): Promise<void> {
    sessionRequest ??= fetchSession();
    return sessionRequest;
  }

  function setUser(user: CurrentUserDto): void {
    currentUser.value = user;
  }

  function clear(): void {
    currentUser.value = null;
  }

  return {
    currentUser: readonly(currentUser),
    ensureLoaded,
    setUser,
    clear,
  };
}
