<template>
	<div class="container mx-auto py-4">
		<div class="flex justify-center gap-4">
			<div class="w-full max-w-lg flex flex-col gap-2">
				<ItemTooltip v-if="itemFromItemId" :item="itemFromItemId" />

				<div v-if="recipesFromItemId && recipesFromItemId.length > 0" class="sticky top-4">
					<div class="flex flex-col gap-4 mt-4">
						<div
							v-for="recipe in recipesFromItemId"
							:key="recipe.pk"
							class="border border-primary/50 flex flex-wrap gap-2 p-2 items-center select-none"
						>
							<div class="flex flex-col gap-2">
								<button
									class="btn btn-primary btn-sm btn-square"
									@click="store.addToQueue(recipe.pk)"
									:disabled="store.countInQueueByRecipeId(recipe.pk) >= 999"
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
										class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M12 5l0 14" />
										<path d="M5 12l14 0" />
									</svg>
								</button>
								<button
									class="btn btn-primary btn-sm btn-square"
									@click="store.removeFromQueue(recipe.pk)"
									:disabled="store.countInQueueByRecipeId(recipe.pk) <= 0"
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
										class="icon icon-tabler icons-tabler-outline icon-tabler-minus size-4"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M5 12l14 0" />
									</svg>
								</button>
							</div>
							<!-- <div>
								<tippy>
									<div
										class="size-18 relative border border-primary"
										:class="[`bg-quality-${recipe.fields.item.quality}`]"
									>
										<span
											class="badge badge-primary font-semibold badge-sm absolute bottom-0 left-0"
											v-if="store.countInQueueByRecipeId(recipe.pk) > 0"
											>&times;{{
												store.countInQueueByRecipeId(recipe.pk) *
												recipe.fields.quantity
											}}</span
										>
										<img
											:src="`/img/items/${recipe.fields.item.icon}`"
											class="w-full h-full object-contain p-2"
											alt=""
											loading="lazy"
										/>
									</div>
									<template #content>
										<ItemTooltip
											:item="store.getItemById(recipe.fields.item.id)"
										/>
									</template>
								</tippy>
							</div> -->
							<div>
								<!-- = -->
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
									class="icon icon-tabler icons-tabler-outline icon-tabler-equal size-5"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M5 10h14" />
									<path d="M5 14h14" />
								</svg>
							</div>
							<div v-if="recipe.fields.workshop">
								<tippy>
									<div
										class="size-18 border border-primary"
										:class="[`bg-quality-${recipe.fields.workshop.quality}`]"
									>
										<img
											:src="`/img/items/${recipe.fields.workshop.icon}`"
											class="w-full h-full object-contain p-2"
											alt=""
											loading="lazy"
										/>
									</div>
									<template #content>
										<ItemTooltip
											:item="store.getItemById(recipe.fields.workshop.id)"
										/>
									</template>
								</tippy>
							</div>
							<div
								v-for="ingredient in ingredients(recipe.fields.ingredients)"
								:key="ingredient.id"
							>
								<tippy>
									<div
										class="size-18 relative border border-primary"
										:class="[`bg-quality-${ingredient.item.quality}`]"
									>
										<span
											class="badge badge-primary font-semibold badge-sm absolute bottom-0 left-0"
											>&times;{{
												store.countInQueueByRecipeId(recipe.pk) > 0
													? `${ingredient.quantity} (${
															store.countInQueueByRecipeId(
																recipe.pk,
															) * ingredient.quantity
														})`
													: ingredient.quantity
											}}</span
										>
										<img
											:src="`/img/items/${ingredient.item.icon}`"
											class="w-full h-full object-contain p-2"
											alt=""
											loading="lazy"
										/>
									</div>
									<template #content>
										<ItemTooltip
											:item="store.getItemById(ingredient.item.id)"
										/>
									</template>
								</tippy>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import ItemTooltip from '@/components/ItemTooltip.vue';

import { useAppStore } from '@/stores/app';

const store = useAppStore();
const { recipes, items } = store;

const route = useRoute();
const recipesFromItemId = ref();
const itemFromItemId = ref();

const loadCurrentRecipe = (slug) => {
	recipesFromItemId.value = recipes.filter((recipe) => recipe.fields.item?.slug === slug);
};

const loadCurrentItem = (slug) => {
	itemFromItemId.value = items.find((item) => item.fields.slug === slug);
};

const ingredients = (ingredients) => {
	return ingredients.sort((a, b) => a.item.name.localeCompare(b.item.name));
};

onMounted(() => {
	loadCurrentRecipe(route.params.slug);
	loadCurrentItem(route.params.slug);
});

onBeforeRouteUpdate((to) => {
	loadCurrentRecipe(to.params.slug);
	loadCurrentItem(to.params.slug);
});
</script>

<style scoped>
.badge {
	padding-left: 0.25rem;
	padding-right: 0.25rem;
}
</style>
