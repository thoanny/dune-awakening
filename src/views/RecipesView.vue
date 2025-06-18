<template>
	<div class="container mx-auto" id="recipes">
		<TitleSection title="Recettes" />
		<div class="flex items-center justify-between px-4 mt-4">
			<div>filters</div>
			<div>
				<button
					class="btn btn-primary"
					v-if="queue.length > 0"
					@click="my_modal_2.showModal()"
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart size-6"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
						<path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
						<path d="M17 17h-11v-14h-2" />
						<path d="M6 5l14 1l-1 7h-13" />
					</svg>
					<div class="badge badge-sm badge-neutral">{{ queue.length }}</div>
				</button>
			</div>
		</div>
		<div class="flex gap-4 mt-4 px-4">
			<div class="w-1/3 flex flex-col gap-2">
				<RouterLink
					:to="{ name: 'recipe', params: { id: recipe.pk } }"
					v-for="recipe in recipes"
					:key="recipe.pk"
					class="flex h-24 bg-black/50 border border-primary/50 hover:border-primary"
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
						<div v-if="recipe.fields.item.details">
							{{ recipe.fields.item.details }}
						</div>
					</div>
					<!-- <pre>{{ recipe }}</pre> -->
				</RouterLink>
			</div>
			<div class="w-2/3">
				<RouterView />
			</div>
		</div>
	</div>
	<dialog ref="my_modal_2" class="modal">
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<h4 class="text-lg font-bold">File d'attente</h4>
			<ul class="list" v-if="queue.length > 0">
				<li class="list-row px-0" v-for="recipe in queue" :key="recipe.id">
					<div v-if="recipe.icon">
						<img class="size-10 rounded-box" :src="`/img/items/${recipe.icon}`" />
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
						:disabled="recipe.count >= 1000"
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
							<img class="size-6 rounded-box" :src="`/img/items/${item?.icon}`" />
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
import { ref } from 'vue';
import TitleSection from '@/components/TitleSection.vue';
import MkIcon from '@/components/MkIcon.vue';

import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const store = useAppStore();
const { recipes } = store;
const { queue } = storeToRefs(store);

const my_modal_2 = ref();
const shoppingList = store.shoppingList();
</script>
