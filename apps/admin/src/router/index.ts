import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './auth.guard.ts';
import { RouteName } from './route-names.ts';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: RouteName.LOGIN,
          component: () => import('@/pages/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', redirect: { name: RouteName.GALLERIES } },
        {
          path: 'galleries',
          name: RouteName.GALLERIES,
          component: () => import('@/pages/GalleriesPage.vue'),
        },
        {
          path: 'galleries/:id',
          name: RouteName.GALLERY,
          component: () => import('@/pages/GalleryPage.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: { name: RouteName.GALLERIES } },
  ],
});

router.beforeEach(authGuard);
