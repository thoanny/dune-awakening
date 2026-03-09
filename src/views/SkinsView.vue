<template>
	<div class="container mx-auto">
		<TitleSection title="Skins d'objets" />
		<div
			class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-x-4 gap-y-2 px-4 mt-6"
		>
			<SkinTile
				v-for="skin in filteredSkins"
				:key="skin.pk"
				:fields="skin.fields"
				:checked="skin.checked"
				@click="handleToggleCheck(skin.pk)"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import LZString from 'lz-string';

import SkinTile from '@/components/SkinTile.vue';
import TitleSection from '@/components/TitleSection.vue';

import skins from '@/data/skins.json';

const filteredSkins = computed(() => {
	return skins
		.map((s) => ({ ...s, checked: skinsChecked.value.indexOf(s.pk) >= 0 }))
		.sort((a, b) => a.fields?.name.localeCompare(b.fields?.name));
});

const skinsChecked = ref([]);

const handleToggleCheck = (skinPk) => {
	const idx = skinsChecked.value.findIndex((skin) => skin === skinPk);
	if (idx < 0) {
		skinsChecked.value.push(skinPk);
	} else {
		skinsChecked.value.splice(idx, 1);
	}

	const localSkins = LZString.compressToEncodedURIComponent(JSON.stringify(skinsChecked.value));
	localStorage.setItem('skins', localSkins);
};

onMounted(() => {
	const localSkins = localStorage.getItem('skins');
	if (localSkins) {
		skinsChecked.value = JSON.parse(LZString.decompressFromEncodedURIComponent(localSkins));
	}
});
</script>
