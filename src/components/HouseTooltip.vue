<template>
	<div class="bg-base-300 rounded-box w-56 py-3 shadow-2xl shadow-base-content/50" v-if="house">
		<h4 class="flex gap-2 items-center font-bold mx-2 justify-center">
			<img
				:src="`/img/houses/${house.name}.webp`"
				alt=""
				class="size-8 object-contain z-20"
			/>
			{{ house.name }}
			<img
				:src="`/img/houses/${house.name}.webp`"
				alt=""
				class="size-8 object-contain z-20"
			/>
		</h4>

		<div class="divider text-sm my-3 text-base-content/75 font-semibold">
			Paliers validés ({{ house.user.step }}/{{ steps_points.length }})
		</div>
		<div class="mx-3 mb-3 relative h-4">
			<div
				v-for="(step, s) in steps_points"
				:key="step"
				class="w-[2px] h-full absolute bg-base-content z-20"
				:class="{
					'left-[calc(5%_-_1px)]': s == 0,
					'left-[calc(25%_-_1px)]': s == 1,
					'left-[calc(50%_-_1px)]': s == 2,
					'left-[calc(75%_-_1px)]': s == 3,
					hidden: s == 4,
				}"
			></div>
			<progress
				class="progress progress-success w-full absolute top-1 z-10"
				:value="house.user.points"
				min="0"
				:max="steps_points.slice(-1)[0]"
			></progress>
		</div>
		<div class="grid grid-cols-2 gap-2 mx-3 mb-3">
			<button
				class="btn btn-primary btn-outline btn-sm"
				@click="handleAddPoints(house.id, 750)"
			>
				+750 points
			</button>
			<button
				class="btn btn-primary btn-outline btn-sm"
				@click="handleAddPoints(house.id, 1000)"
			>
				+1000 pts
			</button>
		</div>
		<div class="mx-3">
			<label class="input input-sm">
				<input
					type="number"
					min="0"
					:max="steps_points.slice(-1)[0]"
					v-model="house.user.points"
					class="text-end"
					@keyup="updateStep(house.id)"
					@change="updateStep(house.id)"
					@wheel.prevent
				/>
				<span class="label">/ 14000</span>
			</label>
		</div>
		<div class="divider text-sm my-3 text-base-content/75 font-semibold">Récompenses</div>
		<label class="flex gap-2 items-center justify-center select-none text-sm" v-if="house.user">
			<input
				type="checkbox"
				class="toggle toggle-success toggle-sm"
				v-model="house.user.picked"
				:disabled="house.user.step === 0"
				@change="handleUpdatePicked"
			/>
			Récupérées
		</label>
		<div class="divider text-sm my-3 text-base-content/75 font-semibold">Statut</div>
		<div class="grid grid-cols-2 gap-2 mx-3">
			<button
				class="btn btn-success btn-sm btn-wide"
				:class="{
					'btn-outline': house.status !== 'w',
				}"
				@click="handleUpdateStatus(house.id, 'w')"
			>
				Atréides
			</button>
			<button
				class="btn btn-error btn-sm btn-wide"
				:class="{
					'btn-outline': house.status !== 'l',
				}"
				@click="handleUpdateStatus(house.id, 'l')"
			>
				Harkonnen
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useLandsraadStore } from '@/stores/landsraad';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps(['houseId']);

const landsraad = useLandsraadStore();
const { steps_points, handleUpdateStep, handleUpdatePicked, handleUpdateStatus, handleAddPoints } =
	landsraad;
const { houses } = storeToRefs(landsraad);

const house = computed(() => {
	return houses.value.find((house) => house.id === props.houseId);
});

const updateStep = useDebounceFn(() => {
	console.log('updateStep');
	handleUpdateStep(props.houseId);
}, 300);
</script>
