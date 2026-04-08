import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: async() => import('@/views/List.vue'),
    },
    {
      path: '/add',
      name: 'add',
      component: async() => import('@/views/Add.vue'),
    },
  ]
})

export default router;
