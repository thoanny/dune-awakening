<template>
	<div
		class="house bg-base-100 border-2 text-center flex flex-col items-center justify-center p-4 gap-1 relative overflow-hidden cursor-pointer"
		:class="{
			'house-lost': house.status === 'l',
			'house-win': house.status === 'w',
			'!opacity-25': house.user.step == 5 && house.user.picked,
		}"
	>
		<div class="absolute top-0 right-0 z-10">
			<div class="h-full w-full absolute top-0 left-0 custom-bg-linear"></div>
			<StripesIcon class="w-full h-full" />
		</div>

		<span class="handle absolute top-2 left-2 cursor-move z-20 text-base-content">
			<img
				:src="`/img/specs/${house.specialization}.webp`"
				alt=""
				class="size-6 object-contain z-20"
			/>
		</span>
		<div
			class="btn btn-sm btn-neutral z-20 btn-square top-1 right-1 absolute"
			v-if="house.user.step > 0 && !house.user.picked"
		>
			<GiftIcon class="size-5" />
		</div>
		<img :src="`/img/houses/${house.name}.webp`" alt="" class="size-12 object-contain z-20" />
		<span class="font-bold z-20 text-shadow text-base-content">
			{{ house.name }}
		</span>
		<span class="z-20 text-xs text-base-content/75 -mt-1 mb-1">{{ house.location.name }}</span>
		<div class="flex items-center justify-center gap-1 w-full z-20">
			<div
				class="size-2"
				v-for="(step, s) in steps_points"
				:key="s"
				:class="{
					'bg-base-content/25': house.user.step < s + 1,
					'bg-base-content': house.user.step >= s + 1,
				}"
			></div>
		</div>
	</div>
</template>

<script setup>
import { useLandsraadStore } from '@/stores/landsraad';
import StripesIcon from '@/icons/StripesIcon.vue';
import ArrowsMoveIcon from '@/icons/ArrowsMoveIcon.vue';
import GiftIcon from '@/icons/GiftIcon.vue';

defineProps(['house']);

const landsraad = useLandsraadStore();
const { steps_points } = landsraad;
</script>

<style scoped>
.house {
	--color: var(--color-base-100);
	border-color: color-mix(in oklab, var(--color-base-content) 33%, transparent);
	color: color-mix(in oklab, var(--color-base-content) 33%, transparent);
	background: var(--color);
}

.house-lost {
	--color: var(--color-error-content);
	border-color: var(--color-error);
	color: var(--color-error);
	background: var(--color);
}

.house-win {
	--color: var(--color-success-content);
	border-color: var(--color-success);
	color: var(--color-success);
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
