<template>
	<div class="container mx-auto">
		<TitleSection title="Objets" />
		<div class="flex gap-4 flex-wrap mx-4 mt-4">
			<tippy v-for="item in items" :key="item.pk">
				<button
					class="size-24 border border-primary bg-black/50"
					:class="[`bg-quality-${item.fields.quality}`]"
				>
					<img
						v-if="item.fields.icon"
						:src="`/img/items/${item.fields.icon}`"
						class="object-contain w-full h-full p-2"
						loading="lazy"
					/>
				</button>
				<template #content>
					<ItemTooltip :item="item" />
				</template>
			</tippy>
		</div>
	</div>
</template>

<script setup>
import TitleSection from '@/components/TitleSection.vue';
import ItemTooltip from '@/components/ItemTooltip.vue';

import { useAppStore } from '@/stores/app';
const store = useAppStore();
const { items } = store;
</script>
