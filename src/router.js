import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ItemsView from '@/views/ItemsView.vue';
import AboutView from '@/views/AboutView.vue';
import RecipesView from '@/views/RecipesView.vue';
import RecipeView from '@/views/RecipeView.vue';
import DevView from '@/views/DevView.vue';

const routes = [
	{ path: '/', name: 'home', component: HomeView },
	{ path: '/objets', name: 'items', component: ItemsView },
	{
		path: '/schemas',
		name: 'recipes',
		component: RecipesView,
		children: [{ path: ':slug', name: 'recipe', component: RecipeView }],
	},
	{ path: '/a-propos', name: 'about', component: AboutView },
	{ path: '/dev', name: 'dev', component: DevView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
