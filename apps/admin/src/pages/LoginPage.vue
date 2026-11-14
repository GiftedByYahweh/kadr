<script setup lang="ts">
import { AppField } from '@kadr/ui';
import { loginRequestSchema, PASSWORD_MIN_LENGTH } from '@kadr/shared';
import { useMutation } from '@tanstack/vue-query';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSession } from '@/composables/useSession.ts';
import { RouteName } from '@/router/route-names.ts';
import { authService } from '@/services/auth.service.ts';

const EMAIL_ERROR = 'Введіть коректний email';
const PASSWORD_ERROR = `Пароль має містити щонайменше ${String(PASSWORD_MIN_LENGTH)} символів`;

const route = useRoute();
const router = useRouter();
const session = useSession();

const form = reactive({ email: '', password: '' });
const submitted = ref(false);

const emailError = computed(() => {
  if (!submitted.value) return '';
  const result = loginRequestSchema.shape.email.safeParse(form.email);
  return result.success ? '' : EMAIL_ERROR;
});

const passwordError = computed(() => {
  if (!submitted.value) return '';
  const result = loginRequestSchema.shape.password.safeParse(form.password);
  return result.success ? '' : PASSWORD_ERROR;
});

function redirectTarget() {
  const redirect = route.query['redirect'];
  const isInternalPath =
    typeof redirect === 'string' &&
    redirect.startsWith('/') &&
    !redirect.startsWith('//');
  if (isInternalPath) return redirect;
  return { name: RouteName.GALLERIES };
}

const login = useMutation({
  mutationFn: authService.login,
  onSuccess: async (user) => {
    session.setUser(user);
    await router.replace(redirectTarget());
  },
});

function submit() {
  submitted.value = true;
  const hasErrors = emailError.value !== '' || passwordError.value !== '';
  if (hasErrors) return;
  login.mutate({ email: form.email, password: form.password });
}
</script>

<template>
  <form class="login" novalidate @submit.prevent="submit">
    <p class="text-secondary">Увійдіть, щоб керувати галереями</p>

    <AppField
      id="login-email"
      v-slot="{ messageId }"
      label="Email"
      :error="emailError"
    >
      <input
        id="login-email"
        v-model="form.email"
        class="field__control"
        type="email"
        autocomplete="email"
        :aria-invalid="emailError !== ''"
        :aria-describedby="messageId"
      />
    </AppField>

    <AppField
      id="login-password"
      v-slot="{ messageId }"
      label="Пароль"
      :error="passwordError"
    >
      <input
        id="login-password"
        v-model="form.password"
        class="field__control"
        type="password"
        autocomplete="current-password"
        :aria-invalid="passwordError !== ''"
        :aria-describedby="messageId"
      />
    </AppField>

    <p v-if="login.error.value" class="notice notice--danger" role="alert">
      {{ login.error.value.message }}
    </p>

    <button
      type="submit"
      class="btn btn--primary btn--block text-upper"
      :disabled="login.isPending.value"
    >
      Увійти
    </button>
  </form>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
</style>
