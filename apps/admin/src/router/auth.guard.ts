import type { NavigationGuard } from 'vue-router';
import { useSession } from '@/composables/useSession.ts';
import { RouteName } from './route-names.ts';

export const authGuard: NavigationGuard = async (to) => {
  const session = useSession();
  await session.ensureLoaded();

  const isLoggedIn = session.currentUser.value !== null;
  const isPublic = to.meta.public === true;

  if (!isLoggedIn && !isPublic) {
    return { name: RouteName.LOGIN, query: { redirect: to.fullPath } };
  }
  if (isLoggedIn && to.name === RouteName.LOGIN) {
    return { name: RouteName.GALLERIES };
  }
  return true;
};
