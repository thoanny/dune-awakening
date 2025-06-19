import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ItemsView from '@/views/ItemsView.vue';
import AboutView from '@/views/AboutView.vue';
import RecipesView from '@/views/RecipesView.vue';
import RecipeView from '@/views/RecipeView.vue';
import DevView from '@/views/DevView.vue';

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/items', component: ItemsView },
	{
		path: '/recipes',
		component: RecipesView,
		children: [{ path: ':id', name: 'recipe', component: RecipeView }],
	},
	{ path: '/about', component: AboutView },
	{ path: '/dev', component: DevView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
