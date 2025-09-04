<template>
	<div class="flex flex-col cursor-pointer">
		<div
			class="font-semibold text-center leading-none text-sm border-2 border-b-0 py-2 text-primary"
			:class="{
				'border-primary ': !checked,
				'border-success': checked,
			}"
		>
			{{ name }}
		</div>
		<div
			class="border-2 relative bg-primary flex justify-center border-t-0"
			:class="{
				'border-primary ': !checked,
				'border-success': checked,
			}"
		>
			<div class="flex gap-2 justify-center absolute top-2 text-primary">
				<tippy class="size-8 bg-base-100 flex justify-center items-center" v-if="light">
					<ArmorLightIcon class="size-6" />
					<template #content>
						<div class="bg-[#2d2825] text-[#ffda94] text-shadow shadow-xl/50 text-sm">
							<div class="px-3 py-2">Armure légère</div>
						</div>
					</template>
				</tippy>
				<tippy class="size-8 bg-base-100 flex justify-center items-center" v-if="heavy">
					<ArmorHeavyIcon class="size-6" />
					<template #content>
						<div class="bg-[#2d2825] text-[#ffda94] text-shadow shadow-xl/50 text-sm">
							<div class="px-3 py-2">Armure lourde</div>
						</div>
					</template>
				</tippy>
				<tippy class="size-8 bg-base-100 flex justify-center items-center" v-if="stillsuit">
					<ArmorStillsuiteIcon class="size-6" />
					<template #content>
						<div class="bg-[#2d2825] text-[#ffda94] text-shadow shadow-xl/50 text-sm">
							<div class="px-3 py-2">Distille</div>
						</div>
					</template>
				</tippy>
			</div>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 109.57">
				<g>
					<polygon points="72 0 72 49.94 36 86.26 0 49.94 0 0 72 0" :fill="top" />
					<polygon
						points="34.95 87.32 12.9 109.57 0 109.57 0 52.06 34.95 87.32"
						:fill="left"
					/>
					<polygon
						points="72 52.07 72 109.57 59.1 109.57 37.06 87.32 72 52.07"
						:fill="right"
					/>
					<polygon
						points="56.99 109.57 15.01 109.57 36 88.39 56.99 109.57"
						:fill="bottom"
					/>
				</g>
			</svg>
		</div>
		<div class="flex justify-center -mt-4 z-10">
			<CheckboxIcon class="size-8" :checked="checked" />
		</div>

		<div class="flex gap-2 justify-center" v-if="false">
			<button class="btn btn-outline btn-primary btn-square" v-if="light">
				<ArmorLightIcon class="size-7" />
			</button>
			<button class="btn btn-outline btn-primary btn-square" v-if="heavy">
				<ArmorHeavyIcon class="size-7" />
			</button>
			<button class="btn btn-outline btn-primary btn-square" v-if="stillsuit">
				<ArmorStillsuiteIcon class="size-7" />
			</button>
		</div>
	</div>
</template>

<script setup>
import ArmorHeavyIcon from '@/icons/ArmorHeavyIcon.vue';
import ArmorLightIcon from '@/icons/ArmorLightIcon.vue';
import ArmorStillsuiteIcon from '@/icons/ArmorStillsuiteIcon.vue';
import CheckboxIcon from '@/icons/CheckboxIcon.vue';

const props = defineProps(['fields', 'checked']);

const {
	name = 'Sans nom',
	color_top: top = 'red',
	color_right: right = 'blue',
	color_bottom: bottom = 'yellow',
	color_left: left = 'green',
	armor_light: light = false,
	armor_heavy: heavy = false,
	armor_stillsuit: stillsuit = false,
} = props.fields;
</script>
