import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ItemsView from '@/views/ItemsView.vue';
import LandsraadView from '@/views/LandsraadView.vue';
import DevView from '@/views/DevView.vue';
import ItemView from '@/views/ItemView.vue';
import QueueView from './views/QueueView.vue';
import HousesView from './views/HousesView.vue';
import SkinsView from './views/SkinsView.vue';

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
	{ path: '/houses', name: 'houses', component: HousesView },
	{ path: '/dev', name: 'dev', component: DevView },
	{ path: '/liste-de-courses', name: 'queue', component: QueueView },
	{ path: '/skins', name: 'skins', component: SkinsView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
