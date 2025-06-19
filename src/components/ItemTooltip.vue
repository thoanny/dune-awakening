<template>
	<div
		class="flex flex-col divide-y-1 divide-[#1c1c1c] bg-[#2d2825] min-w-xs text-[#ffda94] text-shadow shadow-xl/50"
	>
		<div class="border border-primary px-4 py-3 font-semibold">
			<div class="uppercase text-[#c1995c]" v-if="item.fields.type">
				<template v-if="item.fields.type.parent_name">
					{{ item.fields.type.parent_name }} -
				</template>
				{{ item.fields.type.name }}
			</div>
			<div class="text-lg">{{ item.fields.name }}</div>
			<div class="italic text-[#c1995c]">
				{{ item.fields.category?.name }}
				<template v-if="item.fields.category && item.fields.subcategory"> - </template>
				{{ item.fields.subcategory?.name }}
			</div>
		</div>
		<div
			class="h-36 px-4 py-3 relative bg-base-300"
			:class="[`bg-quality-${item.fields.quality}`]"
		>
			<MkIcon :level="item.fields.level" class="size-4 absolute top-3 right-4" />
			<span v-if="item.fields.volume" class="absolute bottom-3 left-4"
				>{{ volume(item.fields.volume) }}V</span
			>
			<img
				v-if="item.fields.icon"
				:src="`/img/items/${item.fields.icon}`"
				:alt="item.fields.name"
				class="object-contain w-full h-full"
			/>
		</div>
		<div class="px-4 py-3" v-if="item.fields.description">
			{{ item.fields.description }}
		</div>
		<div class="px-4 py-3" v-else-if="item.fields.details">
			{{ item.fields.details }}
		</div>
		<div
			class="bg-[#1c1c1c] flex flex-col divide-y-1 divide-[#2d2825]"
			v-if="item.fields.sources.length > 0"
		>
			<span class="px-4 py-2" v-for="source in item.fields.sources" :key="source.id">{{
				source.name
			}}</span>
		</div>
		<div class="flex flex-col divide-y-1 divide-[#1c1c1c]" v-if="item.fields.stats.length > 0">
			<div
				class="flex justify-between px-4 py-2 gap-4"
				v-for="stat in item.fields.stats"
				:key="stat.id"
			>
				<span>{{ stat.name }}</span>
				<span>{{ stat.value }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps(['item']);

import { computed } from 'vue';
import MkIcon from './MkIcon.vue';

const volume = (size) =>
	computed(() => {
		return (size / 100).toLocaleString('fr');
	});
</script>
