import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import items from '@/data/items.json';
import recipes from '@/data/recipes.json';

export const useAppStore = defineStore('app', () => {
	const queue = ref([]);

	const getItemById = (itemId) => {
		return items.find((item) => item.pk === itemId);
	};

	const getRecipeById = (recipeId) => {
		return recipes.find((recipe) => recipe.pk === recipeId);
	};

	const addToQueue = (recipeId) => {
		const recipe = getRecipeById(recipeId);
		if (!recipe) {
			alert('Recipe not found!');
			return false;
		}

		const idx = queue.value.findIndex((q) => q.id === recipe.pk);
		if (idx < 0) {
			queue.value.push({
				id: recipe.pk,
				slug: recipe.fields.item.slug,
				name:
					recipe.fields.quantity > 1
						? `${recipe.fields.item.name} [×${recipe.fields.quantity}]`
						: recipe.fields.item.name,
				icon: recipe.fields.item.icon,
				count: 1,
			});
		} else {
			queue.value[idx].count++;
		}
		saveQueueToLocal();
	};

	const removeFromQueue = (recipeId) => {
		const idx = queue.value.findIndex((q) => q.id === recipeId);
		if (idx < 0) {
			return false;
		} else {
			if (queue.value[idx].count === 1) {
				queue.value.splice(idx, 1);
			} else {
				queue.value[idx].count--;
			}
		}
		saveQueueToLocal();
	};

	const countInQueueByRecipeId = (recipeId) => {
		return queue.value.find((q) => q.id === recipeId)?.count ?? 0;
	};

	const shoppingList = () =>
		computed(() => {
			let list = [];
			queue.value.forEach((q) => {
				const recipe = recipes.find((recipe) => recipe.pk === q.id);
				if (recipe) {
					const ingredients = recipe.fields.ingredients;
					ingredients.forEach((ingredient) => {
						const idx = list.findIndex((l) => l.id === ingredient.item.id);
						if (idx < 0) {
							list.push({
								id: ingredient.item.id,
								slug: ingredient.item.slug,
								name: ingredient.item.name,
								icon: ingredient.item.icon,
								total: ingredient.quantity * q.count,
							});
						} else {
							list[idx].total = list[idx].total + ingredient.quantity * q.count;
						}
					});
				}
			});

			return list.length > 0 ? list : null;
		});

	const saveQueueToLocal = () => {
		localStorage.setItem('recipes-queue', JSON.stringify(queue.value));
	};

	const queueLocal = JSON.parse(localStorage.getItem('recipes-queue'));
	if (queueLocal) {
		queue.value = queueLocal;
	}

	const getTotalItems = () => {
		return items.length;
	};

	const getTotalRecipes = () => {
		return recipes.length;
	};

	const kills = [
		{
			id: -1,
			name: 'Troupes de la maison Harkonen',
		},
		{
			id: -2,
			name: 'Troupes de la maison Atréides',
		},
		{
			id: -3,
			name: 'Déserteurs (Désert Profond)',
		},
		{
			id: -4,
			name: "Pilleurs d'épaves",
		},
		{
			id: -5,
			name: 'Esclavagistes',
		},
		{
			id: -6,
			name: 'Diptères des sables',
		},
		{
			id: -7,
			name: 'Maas Kharet',
		},
		{
			id: -8,
			name: 'Kirabs',
		},
		{
			id: -9,
			name: 'Déserteurs (Bassin de Hagga)',
		},
	];

	return {
		items,
		recipes,
		queue,
		kills,
		shoppingList,
		getItemById,
		getRecipeById,
		addToQueue,
		removeFromQueue,
		countInQueueByRecipeId,
		getTotalItems,
		getTotalRecipes,
	};
});
