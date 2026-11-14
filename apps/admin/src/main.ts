import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import '@kadr/ui/styles.css';
import './styles/admin.css';
import App from './App.vue';
import { router } from './router/index.ts';

createApp(App).use(router).use(VueQueryPlugin).mount('#app');
