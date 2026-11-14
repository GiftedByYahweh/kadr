<template>
  <section class="galleries">
    <h1 class="galleries__title">Галереї клієнтів</h1>
    <p class="text-secondary">Тут з'явиться список галерей.</p>
  </section>
</template>

<style scoped>
.galleries {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.galleries__title {
  font-size: var(--font-size-l);
  line-height: var(--line-height-tight);
}
</style>
