<template>
	<div class="container mx-auto my-6">
		<TitleSection title="Maisons" />
		<p class="px-4 mt-4">
			Seuls les représentants des maisons où vous devez aller récupérer une récompense
			s'affichent. Cliquez dessus pour indiquer que vous avez récupéré vos récompenses.
		</p>

		<div
			class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 px-4"
			v-if="outsideMapHouses.length > 0"
		>
			<div
				class="bg-base-100 hover:bg-base-300 border-2 border-white flex gap-2 items-center py-2 px-3 leading-5 cursor-pointer"
				v-for="house in outsideMapHouses"
				:key="house.id"
				@click="handleUpdatePicked(house.id)"
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

		<div class="mt-4 px-4 relative">
			<img
				src="/img/bassin-hagga_compressed.jpg"
				class="rounded absolute relative z-10 block"
				alt=""
			/>
			<div class="z-20 absolute top-0 left-0 w-full h-full px-4">
				<div
					v-for="house in onMapHouses"
					:key="house.id"
					class="size-10 shadow/100 border-2 bg-base-100 border-white rounded-full absolute flex items-center justify-center cursor-pointer"
					:style="`left: calc(${house.map?.x}% - 1.25rem); top: calc(${house.map?.y}% - 1.25rem)`"
					@click="handleUpdatePicked(house.id)"
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
	return houses.value.filter(
		(house) => house.map?.x && house.map?.y && house.user.step > 0 && !house.user.picked,
	);
});

const outsideMapHouses = computed(() => {
	return houses.value.filter((house) => !house.map && house.user.step > 0 && !house.user.picked);
});
</script>
