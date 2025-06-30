<template>
	<div class="max-w-xl mx-auto">
		<TitleSection title="File d'attente" />
		<div class="px-4 mt-4">
			<h4 class="text-lg font-bold">File d'attente</h4>
			<ul class="list" v-if="queue.length > 0">
				<li class="list-row px-0" v-for="recipe in queue" :key="recipe.id">
					<div>
						<img
							class="size-10 rounded-box"
							:src="`/img/items/${recipe.icon}`"
							loading="lazy"
							v-if="recipe.icon"
						/>
					</div>
					<div class="self-center">
						<RouterLink :to="{ name: 'item', params: { slug: recipe.slug } }">{{
							recipe.name
						}}</RouterLink>
					</div>
					<button class="btn btn-square" @click="store.removeFromQueue(recipe.id)">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-minus size-5"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M5 12l14 0" />
						</svg>
					</button>
					<div class="w-10 self-center text-center">{{ recipe.count }}</div>
					<button
						class="btn btn-square"
						@click="store.addToQueue(recipe.id)"
						:disabled="recipe.count >= 500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-5"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 5l0 14" />
							<path d="M5 12l14 0" />
						</svg>
					</button>
				</li>
			</ul>
			<div v-else>Aucune recette sélectionnée...</div>

			<template v-if="shoppingList?.length > 0">
				<h4 class="text-lg font-bold">Liste de course</h4>
				<ul class="list !mb-0">
					<li class="list-row px-0" v-for="item in shoppingList" :key="item.id">
						<div v-if="item?.icon">
							<img
								class="size-6 rounded-box"
								:src="`/img/items/${item?.icon}`"
								loading="lazy"
								alt=""
							/>
						</div>
						<div class="self-center">
							<RouterLink :to="{ name: 'item', params: { slug: item.slug } }">{{
								item.name
							}}</RouterLink>
						</div>
						<div class="self-center text-end">&times; {{ item.total }}</div>
					</li>
				</ul>
			</template>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TitleSection from '@/components/TitleSection.vue';
import MkIcon from '@/components/MkIcon.vue';

import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const store = useAppStore();
const { recipes } = store;
const { queue } = storeToRefs(store);

const shoppingModal = ref();
const searchValue = ref();
const shoppingList = store.shoppingList();

const filteredRecipes = computed(() => {
	return (
		[...recipes]
			.sort((a, b) => a.fields.item.name.localeCompare(b.fields.item.name))
			// .filter((recipe) => {
			// 	if (!filteredWorkshop.value) {
			// 		return true;
			// 	}
			// 	if (recipe.fields.workshop?.id === filteredWorkshop.value) {
			// 		return true;
			// 	}
			// 	return false;
			// })
			.filter((recipe) => {
				if (!searchValue.value) {
					return true;
				}
				const s = searchValue.value
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
					.toLowerCase();

				return (
					recipe.fields.item.name
						.normalize('NFD')
						.replace(/\p{Diacritic}/gu, '')
						.toLowerCase()
						.indexOf(s) >= 0
				);
			})
			.reduce((previous, current) => {
				if (
					previous &&
					!previous.find((recipe) => recipe.fields.item?.id === current.fields.item?.id)
				) {
					previous.push(current);
				}
				return previous;
			}, [])
	);
});

// const filteredWorkshop = ref('');

// const workshops = computed(() => {
// 	return recipes
// 		.map((recipe) => {
// 			if (recipe.fields.workshop) {
// 				return { id: recipe.fields.workshop.id, name: recipe.fields.workshop.name };
// 			} else {
// 				return;
// 			}
// 		})
// 		.reduce((previous, current) => {
// 			if (previous && !previous.find((item) => item?.id === current?.id)) {
// 				previous.push(current);
// 			}
// 			return previous;
// 		}, [])
// 		.filter((recipe) => !!recipe);
// });
</script>
