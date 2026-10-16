<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  coverUrl: string;
}>();
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${coverUrl})` }">
    <div class="hero__overlay">
      <h1 class="text-display text-italic">{{ title }}</h1>
      <p class="text-upper">{{ subtitle }}</p>
      <a class="text-upper text-hover" href="#photos">view photos ↓</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  background-position: center;
  background-size: cover;
}

.hero__overlay {
  height: 100%;
  display: grid;
  place-content: center;
  gap: var(--space-3);
  padding: var(--page-padding);
  text-align: center;
  background: var(--color-overlay);
  color: var(--color-inverse-text);
}
</style>
