<template>
	<div
		class="house bg-base-100 border-2 text-center flex flex-col items-center justify-center p-4 gap-1 relative overflow-hidden"
		:class="{
			'house-edit': editMode,
			'house-wish': house.wish_id && !house.status,
			'house-lost': house.status === 'l',
			'house-win': house.status === 'w',
			'cursor-pointer': !editMode,
			'!opacity-25': house.user.step == 5 && house.user.picked,
		}"
		@click="$emit('openModal', house.id)"
	>
		<div class="absolute top-0 right-0 z-10">
			<div class="h-full w-full absolute top-0 left-0 custom-bg-linear"></div>
			<StripesIcon class="w-full h-full" />
		</div>
		<span
			class="handle absolute top-2 left-2 cursor-move z-20 text-base-content"
			v-show="editMode"
		>
			<ArrowsMoveIcon class="size-5" />
		</span>
		<input
			type="checkbox"
			class="checkbox absolute top-2 right-2 z-20 !bg-base-100"
			:value="house.id"
			:indeterminate="house.status === 'l'"
			@change.prevent="handleUpdateStatus(house.id, 'w')"
			@contextmenu.prevent="handleUpdateStatus(house.id, 'l')"
			:checked="house.status === 'w'"
			v-show="editMode"
		/>

		<div
			class="btn btn-sm btn-primary z-20 btn-square top-1 right-1 absolute"
			v-if="!editMode && house.user.step > 0 && !house.user.picked"
		>
			<GiftIcon class="size-5" />
		</div>
		<img :src="`/img/houses/${house.name}.webp`" alt="" class="size-12 object-contain z-20" />
		<span class="font-bold z-20 text-shadow text-base-content">
			{{ house.name }}
			<span
				class="text-xs text-base-content opacity-75"
				v-if="house.user.step > 0 && house.user.step < 5 && !editMode"
				>({{ house.user.step }}/5)</span
			>
		</span>
		<select
			v-model="wishId"
			@change="handleUpdateWish(house.id, wishId)"
			class="select select-xs w-full relative !z-20 text-base-content"
			v-if="editMode"
		>
			<option value="0">---</option>
			<optgroup label="Livrer">
				<option v-for="item in items" :key="item.pk" :value="item.pk">
					{{ item.fields.name }}
				</option>
			</optgroup>
			<optgroup label="Tuer">
				<option v-for="kill in kills" :key="kill.id" :value="kill.id">
					{{ kill.name }}
				</option>
			</optgroup>
		</select>
		<template v-else>
			<tippy v-if="house.wish.type === 'item'">
				<div class="flex gap-1 items-center justify-center relative z-20 h-6">
					<RouterLink
						:to="{
							name: 'item',
							params: { slug: house.wish.data?.fields.slug },
						}"
						class="text-sm line-clamp-1"
						v-if="house.wish"
						>Livrer&nbsp;: {{ house.wish.data?.fields.name }}</RouterLink
					>
				</div>
				<template #content>
					<ItemTooltip :item="house.wish.data" v-if="house.wish" />
				</template>
			</tippy>
			<div
				class="flex gap-1 items-center h-6 text-sm z-20"
				v-else-if="house.wish.type === 'kill'"
			>
				<span class="line-clamp-1">Tuer&nbsp;: {{ house.wish.data?.name }}</span>
			</div>
			<span class="z-20" v-else> --- </span>
		</template>
	</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useLandsraadStore } from '@/stores/landsraad';
import { storeToRefs } from 'pinia';
import ItemTooltip from '@/components/ItemTooltip.vue';
import StripesIcon from '@/icons/StripesIcon.vue';
import ArrowsMoveIcon from '@/icons/ArrowsMoveIcon.vue';
import GiftIcon from '@/icons/GiftIcon.vue';

const props = defineProps(['house']);
const wishId = ref(null);
const landsraad = useLandsraadStore();
const { kills, items, handleUpdateWish, handleUpdateStatus } = landsraad;
const { editMode } = storeToRefs(landsraad);

watchEffect(() => {
	wishId.value = props.house.wish_id;
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
