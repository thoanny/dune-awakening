<template>
	<div class="container mx-auto" id="recipes">
		<TitleSection title="Recettes" />
		<div class="flex items-center justify-between px-4 mt-4 gap-4">
			<div class="flex flex-1">
				<input
					type="text"
					v-model="searchValue"
					placeholder="Chercher une recette"
					class="input input-bordered w-full"
				/>
			</div>
			<div v-if="queue.length > 0">
				<button class="btn btn-primary" @click="shoppingModal.showModal()">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart size-6"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
						<path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
						<path d="M17 17h-11v-14h-2" />
						<path d="M6 5l14 1l-1 7h-13" />
					</svg>
					<div class="badge badge-sm badge-neutral">
						{{
							queue
								.map((q) => q.count)
								.reduce((previous, current) => previous + current)
						}}
					</div>
				</button>
			</div>
		</div>
		<div class="flex flex-col-reverse xl:flex-row gap-4 mt-4 px-4">
			<div class="w-full xl:w-1/3 flex flex-col gap-2">
				<RouterLink
					:to="{ name: 'recipe', params: { id: recipe.fields.item.id } }"
					v-for="recipe in filteredRecipes"
					:key="recipe.pk"
					class="flex h-22 bg-black/50 border border-primary/50 hover:border-primary"
				>
					<div
						class="aspect-square h-full shrink-0 relative"
						:class="[`bg-quality-${recipe.fields.item.quality}`]"
					>
						<MkIcon
							:level="recipe.fields.item.level"
							class="size-3 absolute top-2 right-1 text-primary"
						/>
						<img
							:src="`/img/items/${recipe.fields.item.icon}`"
							class="object-contain w-full h-full p-2"
							alt=""
							loading="lazy"
							v-if="recipe.fields.item.icon"
						/>
					</div>
					<div
						class="flex flex-col grow-1 px-4 py-3 justify-center text-primary text-shadow"
					>
						<div class="text-lg font-semibold line-clamp-1">
							<template v-if="recipe.fields.quantity > 1">
								{{ recipe.fields.quantity }}&nbsp;×
							</template>
							{{ recipe.fields.item.name }}
						</div>
					</div>
					<!-- <pre>{{ recipe }}</pre> -->
				</RouterLink>
			</div>
			<div class="w-full xl:w-2/3">
				<RouterView />
			</div>
		</div>
	</div>
	<dialog ref="shoppingModal" class="modal">
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
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
						<div>{{ recipe.name }}</div>
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
							<div>{{ item.name }}</div>
						</div>
						<div class="self-center text-end">&times; {{ item.total }}</div>
					</li>
				</ul>
			</template>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
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
