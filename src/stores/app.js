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
			console.log('false;');
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
		console.log(queue.value);
	}

	return {
		items,
		recipes,
		queue,
		shoppingList,
		getItemById,
		getRecipeById,
		addToQueue,
		removeFromQueue,
		countInQueueByRecipeId,
	};
});
