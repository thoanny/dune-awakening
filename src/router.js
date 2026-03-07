import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import LandsraadView from '@/views/LandsraadView.vue';
import HousesView from './views/HousesView.vue';
import SkinsView from './views/SkinsView.vue';

const routes = [
	{ path: '/', name: 'home', component: HomeView },
	{ path: '/landsraad', name: 'landsraad', component: LandsraadView },
	{ path: '/houses', name: 'houses', component: HousesView },
	{ path: '/skins', name: 'skins', component: SkinsView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
