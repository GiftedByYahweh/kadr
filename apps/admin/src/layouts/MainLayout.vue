<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useSession } from '@/composables/useSession.ts';
import { RouteName } from '@/router/route-names.ts';
import { authService } from '@/services/auth.service.ts';

const session = useSession();
const router = useRouter();

const sections = [
  { label: 'Огляд', icon: 'icon--home', routeName: null },
  {
    label: 'Галереї клієнтів',
    icon: 'icon--grid',
    routeName: RouteName.GALLERIES,
  },
  { label: 'Портфоліо', icon: 'icon--image', routeName: null },
  { label: 'Налаштування', icon: 'icon--settings', routeName: null },
];

const logout = useMutation({
  mutationFn: authService.logout,
  onSuccess: async () => {
    session.clear();
    await router.replace({ name: RouteName.LOGIN });
  },
});
</script>

<template>
  <div class="main-layout">
    <nav class="sidebar" aria-label="Головна навігація">
      <div class="sidebar__brand">
        <span class="sidebar__logo text-italic">kadr</span>
        <span class="sidebar__tag text-upper text-secondary">admin</span>
      </div>

      <div class="sidebar__items">
        <template v-for="section in sections" :key="section.label">
          <RouterLink
            v-if="section.routeName"
            :to="{ name: section.routeName }"
            class="sidebar__item"
            active-class="sidebar__item--active"
          >
            <span class="icon icon--s" :class="section.icon" />
            {{ section.label }}
          </RouterLink>
          <span v-else class="sidebar__item sidebar__item--disabled">
            <span class="icon icon--s" :class="section.icon" />
            {{ section.label }}
            <span class="sidebar__soon text-upper">згодом</span>
          </span>
        </template>
      </div>

      <div v-if="session.currentUser.value" class="sidebar__user">
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">
            {{ session.currentUser.value.username }}
          </span>
          <span class="sidebar__user-email text-secondary">
            {{ session.currentUser.value.email }}
          </span>
        </div>
        <button
          class="icon-button"
          aria-label="Вийти"
          :disabled="logout.isPending.value"
          @click="logout.mutate()"
        >
          <span class="icon icon--s icon--logout" />
        </button>
      </div>
    </nav>

    <main class="main-layout__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
}

.main-layout__content {
  flex: 999 1 560px;
  min-width: 0;
  padding: var(--space-6) var(--space-7);
}

.sidebar {
  flex: 1 1 240px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-5) var(--space-4);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.sidebar__brand {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  padding: 0 var(--space-2);
}

.sidebar__logo {
  font-size: var(--font-size-lead);
  font-weight: 700;
}

.sidebar__tag,
.sidebar__soon {
  font-family: var(--font-family-base);
  font-size: var(--font-size-s);
}

.sidebar__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--control-height);
  padding: 0 var(--space-3);
}

.sidebar__item--active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 600;
}

.sidebar__item--disabled {
  color: var(--color-text-secondary);
}

.sidebar__soon {
  margin-left: auto;
}

.sidebar__user {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2) 0;
  border-top: 1px solid var(--color-border);
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar__user-name {
  font-weight: 600;
}

.sidebar__user-email {
  font-size: var(--font-size-s);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
