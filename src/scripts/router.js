// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ReadmeLayout from '../components/ReadmeLayout.vue';
import LogHome from '../components/LogHome.vue';
import Home from '../components/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/readme',
    name: 'Readme',
    component: ReadmeLayout
  /*},
  {
    path: '/logs',
    name: 'Logs',
    component: LogHome*/
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
