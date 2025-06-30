<template>
	<div class="container mx-auto">
		<TitleSection title="Objets" />
		<div class="flex gap-4 mt-4 px-4">
			<select class="select select-bordered w-auto" v-model="filteredCategory">
				<option value="">--- Catégories ---</option>
				<option :value="category.id" v-for="category in categories" :key="category.id">
					{{ category.name }}
				</option>
			</select>
			<select class="select select-bordered w-auto" v-model="filteredSubcategory">
				<option value="">--- Sous-catégories ---</option>
				<option
					:value="subcategory.id"
					v-for="subcategory in subcategories"
					:key="subcategory.id"
				>
					{{ subcategory.name }}
				</option>
			</select>
			<select class="select select-bordered w-auto" v-model="filteredType">
				<option value="">--- Type ---</option>
				<option :value="type.id" v-for="type in types" :key="type.id">
					{{ type.name }}
				</option>
			</select>
			<button
				class="btn btn-primary btn-square"
				@click="resetFilters"
				v-show="filteredCategory || filteredSubcategory || filteredType"
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
					class="icon icon-tabler icons-tabler-outline icon-tabler-filter-x"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M13.758 19.414l-4.758 1.586v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v1.5"
					/>
					<path d="M22 22l-5 -5" />
					<path d="M17 22l5 -5" />
				</svg>
			</button>
		</div>
		<div class="flex gap-4 flex-wrap mx-4 mt-4" v-if="filteredItems.length > 0">
			<tippy v-for="item in filteredItems" :key="item.pk">
				<RouterLink
					:to="{ name: 'item', params: { slug: item.fields.slug } }"
					class="size-24 block border border-primary bg-black/50"
					:class="[`bg-quality-${item.fields.quality}`]"
				>
					<img
						v-if="item.fields.icon"
						:src="`/img/items/${item.fields.icon}`"
						class="object-contain w-full h-full p-2"
						loading="lazy"
					/>
				</RouterLink>
				<template #content>
					<ItemTooltip :item="item" />
				</template>
			</tippy>
		</div>
		<div class="mx-4 mt-4 italic" v-else>Aucun objet trouvé...</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TitleSection from '@/components/TitleSection.vue';
import ItemTooltip from '@/components/ItemTooltip.vue';

import { useAppStore } from '@/stores/app';
const store = useAppStore();
const { items } = store;

const filteredCategory = ref('');
const categories = computed(() => {
	return items
		.map((item) => {
			if (item.fields.category) {
				return { id: item.fields.category.id, name: item.fields.category.name };
			}
		})
		.reduce((previous, current) => {
			if (previous && !previous.find((item) => item?.id === current?.id)) {
				previous.push(current);
			}
			return previous;
		}, [])
		.filter((item) => !!item);
});

const filteredSubcategory = ref('');
const subcategories = computed(() => {
	return items
		.map((item) => {
			if (item.fields.subcategory) {
				return { id: item.fields.subcategory.id, name: item.fields.subcategory.name };
			}
		})
		.reduce((previous, current) => {
			if (previous && !previous.find((item) => item?.id === current?.id)) {
				previous.push(current);
			}
			return previous;
		}, [])
		.filter((item) => !!item);
});

const filteredType = ref('');
const types = computed(() => {
	return items
		.map((item) => {
			if (item.fields.type) {
				return {
					id: item.fields.type.id,
					name: item.fields.type.parent_name
						? `${item.fields.type.name} (${item.fields.type.parent_name})`
						: item.fields.type.name,
				};
			}
		})
		.reduce((previous, current) => {
			if (previous && !previous.find((item) => item?.id === current?.id)) {
				previous.push(current);
			}
			return previous;
		}, [])
		.filter((item) => !!item)
		.sort((a, b) => a.name.localeCompare(b.name));
});

const filteredItems = computed(() => {
	return [...items]
		.sort((a, b) => a.fields.name.localeCompare(b.fields.name))
		.filter((item) => {
			if (!filteredCategory.value) {
				return true;
			}
			return item.fields.category?.id === filteredCategory.value;
		})
		.filter((item) => {
			if (!filteredSubcategory.value) {
				return true;
			}
			return item.fields.subcategory?.id === filteredSubcategory.value;
		})
		.filter((item) => {
			if (!filteredType.value) {
				return true;
			}
			return item.fields.type?.id === filteredType.value;
		});
});

const resetFilters = () => {
	filteredCategory.value = '';
	filteredSubcategory.value = '';
	filteredType.value = '';
};
</script>
