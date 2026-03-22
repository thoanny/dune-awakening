<template>
	<div class="container mx-auto my-6">
		<TitleSection title="Maisons" />
		<p class="px-4 mt-4">
			Les représentants des Grandes Maisons affichées
			<template v-if="housesShowAll">en surbrillance</template> sont ceux auprès de qui vous
			devez récupérer une récompense. Cliquez dessus pour enregistrer que vous avez récupéré
			vos récompenses.
		</p>

		<label class="label mx-4 mt-4" for="houses-show-all">
			<input
				type="checkbox"
				checked="checked"
				class="toggle toggle-primary"
				v-model="housesShowAll"
				id="houses-show-all"
			/>
			Voir toutes les maisons
		</label>

		<div
			class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 px-4"
			v-if="outsideMapHouses.length > 0"
		>
			<div
				class="bg-base-100 hover:bg-base-300 border-2 flex gap-2 items-center py-2 px-3 leading-5 select-none"
				v-for="house in outsideMapHouses"
				:key="house.id"
				@click="
					() => {
						if (house.user?.step > 0) {
							handleUpdatePicked(house.id);
						}
					}
				"
				:class="{
					'opacity-100': house.user?.step > 0 && !house.user?.picked,
					'opacity-50': !house.user?.step || (house.user?.step > 0 && house.user?.picked),
					'cursor-pointer': house.user?.step > 0,
					'border-dashed': !house.user?.step,
					hidden: !housesShowAll && !house.user?.step,
				}"
			>
				<img
					:src="`/img/houses/${house.name}.webp`"
					class="size-12 shrink-0 rounded-full"
					alt=""
				/>
				<span class="flex flex-col">
					<strong>{{ house.name }}</strong>
					<span class="text-sm">{{ house.location.name }}</span>
				</span>
			</div>
		</div>

		<div class="mt-4 px-4 relative select-none">
			<img
				src="/img/bassin-hagga_compressed.jpg"
				class="rounded absolute relative z-10 block"
				alt=""
			/>
			<div class="z-20 absolute top-0 left-0 w-full h-full px-4">
				<div
					v-for="house in onMapHouses"
					:key="house.id"
					class="size-10 shadow/100 border-2 bg-base-100 rounded-full absolute flex items-center justify-center tooltip tooltip-open"
					:data-tip="house.name"
					:style="`left: calc(${house.map?.x}% - 1.25rem); top: calc(${house.map?.y}% - 1.25rem)`"
					@click="
						() => {
							if (house.user?.step > 0) {
								handleUpdatePicked(house.id);
							}
						}
					"
					:class="{
						'opacity-100 z-40': house.user?.step > 0 && !house.user?.picked,
						'opacity-60 z-30':
							!house.user?.step || (house.user?.step > 0 && house.user?.picked),
						'cursor-pointer': house.user?.step > 0,
						'border-dashed': !house.user?.step,
						'tooltip-bottom': ['Richèse', 'Moritani'].indexOf(house.name) >= 0,
						hidden: !housesShowAll && !house.user?.step,
					}"
				>
					<img
						:src="`/img/houses/${house.name}.webp`"
						class="size-8 shrink-0 rounded-full"
						alt=""
					/>
				</div>
			</div>
		</div>
	</div>
	<!-- <pre>{{ houses }}</pre> -->
</template>

<script setup>
import { useStorage } from '@vueuse/core';

import TitleSection from '@/components/TitleSection.vue';

import { useLandsraadStore } from '@/stores/landsraad';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const landsraad = useLandsraadStore();
const { houses } = storeToRefs(landsraad);
const { handleUpdatePicked } = landsraad;

// const handlePageClick = ($event) => {
// 	console.log('handlePageClick');
// 	const rect = $event.target.getBoundingClientRect();
// 	const x = $event.clientX - rect.left;
// 	const y = $event.clientY - rect.top;

// 	const xpc = ((x / $event.target.offsetWidth) * 100).toFixed(2);
// 	const ypc = ((y / $event.target.offsetHeight) * 100).toFixed(2);

// 	console.log(xpc, ypc);
// };

const onMapHouses = computed(() => {
	return houses.value.filter((house) => house.map?.x && house.map?.y);
});

const outsideMapHouses = computed(() => {
	return houses.value
		.filter((house) => !house.map)
		.sort((a, b) => a.name.localeCompare() - b.name.localeCompare());
});

const housesShowAll = useStorage('houses-show-all', false);
</script>

<style>
.filter-success img {
	filter: sepia(100%) saturate(2000%) hue-rotate(435deg);
}
</style>
