<template>
	<div
		class="house bg-base-100 border-2 text-center flex flex-col items-center justify-center p-4 gap-1 relative overflow-hidden"
		:class="{
			'house-edit': editMode,
			'house-wish': house.wish && !house.status,
			// TODO : refine colors
			'house-lost': house.status === 'lost',
			'house-win': house.status === 'win',
		}"
	>
		<div class="absolute top-0 right-0 z-10">
			<div class="h-full w-full absolute top-0 left-0 custom-bg-linear"></div>
			<svg
				id="b"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 138.22 75.98"
				class="w-full h-full"
			>
				<g id="c">
					<polygon
						points="93.08 0 17.1 75.98 14.28 75.98 90.25 0 93.08 0"
						fill="currentColor"
					/>
					<polygon
						points="78.46 75.98 138.22 16.22 138.22 19.05 81.29 75.98 78.46 75.98"
						fill="currentColor"
					/>
					<polygon
						points="92.72 75.98 138.22 30.49 138.22 33.31 95.56 75.98 92.72 75.98"
						fill="currentColor"
					/>
					<polygon
						points="114.13 75.98 138.22 51.89 138.22 54.71 116.95 75.98 114.13 75.98"
						fill="currentColor"
					/>
					<polygon
						points="85.59 75.98 138.22 23.36 138.22 26.18 88.42 75.98 85.59 75.98"
						fill="currentColor"
					/>
					<polygon
						points="71.33 75.98 138.22 9.09 138.22 11.92 74.16 75.98 71.33 75.98"
						fill="currentColor"
					/>
					<polygon
						points="138.22 1.96 138.22 4.78 67.02 75.98 64.2 75.98 138.22 1.96"
						fill="currentColor"
					/>
					<polygon
						points="128.39 75.98 138.22 66.15 138.22 68.98 131.22 75.98 128.39 75.98"
						fill="currentColor"
					/>
					<polygon
						points="114.48 0 38.49 75.98 35.67 75.98 111.65 0 114.48 0"
						fill="currentColor"
					/>
					<polygon
						points="78.81 0 2.84 75.98 0 75.98 75.99 0 78.81 0"
						fill="currentColor"
					/>
					<polygon
						points="100.21 0 24.24 75.98 21.4 75.98 97.39 0 100.21 0"
						fill="currentColor"
					/>
					<polygon
						points="135.87 0 59.89 75.98 57.07 75.98 133.05 0 135.87 0"
						fill="currentColor"
					/>
					<polygon
						points="121.61 0 45.63 75.98 42.8 75.98 118.78 0 121.61 0"
						fill="currentColor"
					/>
					<polygon
						points="107.34 0 31.37 75.98 28.53 75.98 104.52 0 107.34 0"
						fill="currentColor"
					/>
					<polygon
						points="99.86 75.98 138.22 37.62 138.22 40.45 102.69 75.98 99.86 75.98"
						fill="currentColor"
					/>
					<polygon
						points="121.26 75.98 138.22 59.02 138.22 61.84 124.08 75.98 121.26 75.98"
						fill="currentColor"
					/>
					<polygon
						points="85.95 0 9.96 75.98 7.14 75.98 83.12 0 85.95 0"
						fill="currentColor"
					/>
					<polygon
						points="128.74 0 52.76 75.98 49.94 75.98 125.92 0 128.74 0"
						fill="currentColor"
					/>
					<polygon
						points="106.99 75.98 138.22 44.75 138.22 47.58 109.82 75.98 106.99 75.98"
						fill="currentColor"
					/>
				</g>
			</svg>
		</div>
		<span
			class="handle absolute top-2 left-2 cursor-move z-20 text-base-content"
			v-show="editMode"
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
				class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-move size-5"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M18 9l3 3l-3 3" />
				<path d="M15 12h6" />
				<path d="M6 9l-3 3l3 3" />
				<path d="M3 12h6" />
				<path d="M9 18l3 3l3 -3" />
				<path d="M12 15v6" />
				<path d="M15 6l-3 -3l-3 3" />
				<path d="M12 3v6" />
			</svg>
		</span>
		<input
			type="checkbox"
			class="checkbox absolute top-2 right-2 z-20 !bg-base-100"
			:value="house.id"
			:indeterminate="house.status === 'lost'"
			@change.prevent="$emit('houseWin', house.id)"
			@contextmenu.prevent="$emit('houseLost', house.id)"
			:checked="house.status === 'win'"
			v-show="editMode"
		/>
		<img :src="`/img/houses/${house.name}.webp`" alt="" class="size-12 object-contain z-20" />
		<span class="font-bold z-20 text-shadow text-base-content">{{ house.name }}</span>
		<select
			v-model="wish"
			class="select select-xs w-full relative !z-20 text-base-content"
			v-if="!house.status && editMode"
		>
			<option value="">---</option>
			<option v-for="item in filteredItems" :key="item.pk" :value="item.pk">
				{{ item.fields.name }}
			</option>
		</select>
		<tippy v-else-if="!house.status">
			<div class="flex gap-2 items-center justify-center relative z-20 h-6">
				<RouterLink
					:to="{
						name: 'item',
						params: { slug: getItem(house.wish)?.fields.slug },
					}"
					class="text-sm text-shadow line-clamp-1"
					v-if="house.wish"
					>{{ getItem(house.wish)?.fields.name }}</RouterLink
				>
				<span v-else> --- </span>
			</div>
			<template #content>
				<ItemTooltip :item="getItem(house.wish)" v-if="house.wish" />
			</template>
		</tippy>
		<div class="h-6 z-20 text-sm font-semibold text-shadow" v-else>
			{{ house.status === 'win' ? 'Gagné' : 'Perdu' }}
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';
import ItemTooltip from '@/components/ItemTooltip.vue';
import { useAppStore } from '@/stores/app';
const store = useAppStore();
const { items } = store;
const emit = defineEmits(['houseWin', 'houseLost', 'changeWish']);
const props = defineProps(['house', 'editMode']);

const wish = ref('');

const filteredItems = computed(() => {
	return items
		.filter((item) => item.fields?.landsraad === true)
		.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
});

const getItem = (itemId) => {
	return items.find((item) => item.pk === itemId);
};

watch(wish, (newWish, oldWish) => {
	if (newWish === oldWish) {
		return;
	}

	emit('changeWish', props.house.id, wish.value);
});

watchEffect(() => {
	wish.value = props.house.wish;
});
</script>

<style scoped>
.house {
	opacity: 0.5;
}

.house-edit,
.house-wish,
.house-win,
.house-lost {
	opacity: 1;
}

.house-wish {
	--color: #232019;
	border-color: var(--color-primary);
	color: var(--color-primary);
	background: var(--color);
}

.house-lost {
	--color: #241919;
	border-color: #984141;
	color: #984141;
	background: var(--color);
}

.house-win {
	--color: #1a1f1b;
	border-color: #85997a;
	color: #85997a;
	background: var(--color);
}

.custom-bg-linear {
	background: linear-gradient(
		45deg,
		var(--color, var(--color-base-100)) 0%,
		var(--color, var(--color-base-100)) 65%,
		transparent 100%
	);
}
</style>
