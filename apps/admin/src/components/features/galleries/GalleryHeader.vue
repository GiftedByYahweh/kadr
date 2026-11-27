<script setup lang="ts">
import { RouteName } from '@/router/route-names.ts';

const {
  title,
  meta,
  badge = '',
  badgeClass = '',
} = defineProps<{
  title: string;
  meta: string;
  badge?: string;
  badgeClass?: string;
}>();
</script>

<template>
  <header class="gallery-header">
    <RouterLink
      :to="{ name: RouteName.GALLERIES }"
      class="gallery-header__back text-secondary text-hover"
    >
      ← Галереї
    </RouterLink>
    <div class="gallery-header__row">
      <div class="gallery-header__info">
        <div class="gallery-header__title-row">
          <h1 class="gallery-header__title">{{ title }}</h1>
          <span v-if="badge" class="badge" :class="badgeClass">{{
            badge
          }}</span>
        </div>
        <span class="gallery-header__meta text-secondary">{{ meta }}</span>
      </div>
      <div class="gallery-header__actions">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped>
.gallery-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.gallery-header__back {
  align-self: flex-start;
  font-size: var(--font-size-s);
}

.gallery-header__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.gallery-header__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.gallery-header__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.gallery-header__title {
  font-size: var(--font-size-l);
  font-weight: 700;
  line-height: var(--line-height-tight);
  overflow-wrap: anywhere;
}

.gallery-header__meta {
  font-size: var(--font-size-m);
}

.gallery-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
</style>
