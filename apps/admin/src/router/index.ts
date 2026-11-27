import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@/modules/auth/auth.guard.ts';
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
          component: () => import('@/modules/auth/pages/LoginPage.vue'),
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
          component: () => import('@/modules/gallery/pages/GalleriesPage.vue'),
        },
        {
          path: 'galleries/:id',
          name: RouteName.GALLERY,
          component: () => import('@/modules/gallery/pages/GalleryPage.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: { name: RouteName.GALLERIES } },
  ],
});

router.beforeEach(authGuard);
