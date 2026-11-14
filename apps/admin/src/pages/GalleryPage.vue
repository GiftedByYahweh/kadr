<script setup lang="ts">
import { useRoute } from 'vue-router';
import { RouteName } from '@/router/route-names.ts';

const route = useRoute();
</script>

<template>
  <section class="gallery">
    <RouterLink
      :to="{ name: RouteName.GALLERIES }"
      class="text-upper text-secondary gallery__back"
    >
      ← Усі галереї
    </RouterLink>
    <h1 class="gallery__title">Галерея {{ route.params['id'] }}</h1>
    <p class="text-secondary">Тут з'явиться сторінка галереї.</p>
  </section>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.gallery__back {
  font-family: var(--font-family-base);
  font-size: var(--font-size-s);
}

.gallery__title {
  font-size: var(--font-size-l);
  line-height: var(--line-height-tight);
}
</style>
