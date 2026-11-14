<template>
  <main class="auth-layout">
    <div class="auth-layout__card">
      <div class="auth-layout__brand">
        <span class="auth-layout__logo text-italic">kadr</span>
        <span class="text-upper text-secondary auth-layout__tag">admin</span>
      </div>
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: var(--color-surface);
}

.auth-layout__card {
  width: 100%;
  max-width: var(--dialog-width);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-7) var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.auth-layout__brand {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.auth-layout__logo {
  font-size: var(--font-size-l);
  font-weight: 700;
}

.auth-layout__tag {
  font-family: var(--font-family-base);
  font-size: var(--font-size-s);
}
</style>
