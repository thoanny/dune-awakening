<template>
	<div class="container mx-auto">
		<div class="flex items-center">
			<h1 class="title" style="">
				<span class="line-clamp-1">Objets</span>
			</h1>
			<hr class="border-primary w-full" />
		</div>
		<div class="flex gap-4 flex-wrap mx-4 mt-4">
			<tippy v-for="item in items" :key="item.id">
				<button
					class="size-24 border-2 border-primary bg-base-300"
					:class="[`bg-quality-${item.quality}`]"
				>
					<img :src="`/img/items/${item.icon}`" />
				</button>
				<template #content>
					<div
						class="flex flex-col divide-y-1 divide-[#1c1c1c] bg-[#2d2825] min-w-xs text-[#ffda94] text-shadow shadow-xl/50"
					>
						<div class="border border-primary px-4 py-3 font-semibold">
							<div class="uppercase text-[#c1995c]">{{ fullType(item.type_id) }}</div>
							<div class="text-lg">{{ item.name }}</div>
							<div class="italic text-[#c1995c]">
								{{ fullCategory(item.category_id, item.subcategory_id) }}
							</div>
						</div>
						<div
							class="h-36 px-4 py-3 relative bg-base-300"
							:class="[`bg-quality-${item.quality}`]"
						>
							<component
								:is="mk[item.level]"
								v-if="item.level >= 0"
								class="size-4 absolute top-3 right-4"
							/>
							<span v-if="item.volume" class="absolute bottom-3 left-4"
								>{{ volume(item.volume) }}V</span
							>
							<img
								v-if="item.icon"
								:src="`/img/items/${item.icon}`"
								:alt="item.name"
								class="object-contain w-full h-full"
							/>
						</div>
						<div class="px-4 py-3">{{ item.details }}</div>
						<!-- [ ] TODO -->
						<div class="bg-[#1c1c1c] px-4 py-3" v-if="item.source">Source</div>
						<div class="flex flex-col divide-y-1 divide-[#1c1c1c]" v-if="item.stats">
							<div
								class="flex justify-between px-4 py-2"
								v-for="stat in Object.entries(JSON.parse(item.stats))"
								:key="stat"
							>
								<span>{{ stat[0] }}</span>
								<span>{{ stat[1] }}</span>
							</div>
						</div>
					</div>
				</template>
			</tippy>
		</div>
	</div>
</template>

<script setup>
import items from '@/data/items.json';
import categories from '@/data/items_categories.json';
import subcategories from '@/data/items_subcategories.json';
import types from '@/data/items_types.json';
import Mk0Icon from '@/icons/Mk0Icon.vue';
import Mk1Icon from '@/icons/Mk1Icon.vue';
import Mk2Icon from '@/icons/Mk2Icon.vue';
import Mk3Icon from '@/icons/Mk3Icon.vue';
import Mk4Icon from '@/icons/Mk4Icon.vue';
import Mk5Icon from '@/icons/Mk5Icon.vue';
import Mk6Icon from '@/icons/Mk6Icon.vue';

import { computed } from 'vue';

const mk = [Mk0Icon, Mk1Icon, Mk2Icon, Mk3Icon, Mk4Icon, Mk5Icon, Mk6Icon];

const fullCategory = (category_id, subcategory_id) =>
	computed(() => {
		const category = categories.find((category) => category.id === category_id);
		const subcategory = subcategories.find((subcategory) => subcategory.id === subcategory_id);
		return [category.name, subcategory.name].join(' - ');
	});

const fullType = (type_id) =>
	computed(() => {
		const type = types.find((type) => type.id === type_id);
		const parentType = types.find((ptype) => ptype.id === type.parent_id);
		return [parentType.name, type.name].join(' - ');
	});

const volume = (size) =>
	computed(() => {
		return (size / 10).toLocaleString('fr');
	});
</script>
