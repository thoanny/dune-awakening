import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ItemsView from '@/views/ItemsView.vue';
import AboutView from '@/views/AboutView.vue';
import LandsraadView from '@/views/LandsraadView.vue';
import DevView from '@/views/DevView.vue';
import ItemView from '@/views/ItemView.vue';

const routes = [
	{ path: '/', name: 'home', component: HomeView },
	{
		path: '/objets',
		children: [
			{ path: '', name: 'items', component: ItemsView },
			{ path: ':slug', name: 'item', component: ItemView },
		],
	},
	{ path: '/landsraad', name: 'landsraad', component: LandsraadView },
	{ path: '/a-propos', name: 'about', component: AboutView },
	{ path: '/dev', name: 'dev', component: DevView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
