<template>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-xl font-bold text-primary">Partager votre code</h3>
		<p class="py-4">
			Diffusez le code suivant pour partager l'état actuel de votre landsraad avec d'autres
			personnes.
		</p>
		<p class="break-all text-xs border border-white/25 p-2">{{ exportHousesCode }}</p>
		<h3 class="text-xl text-primary font-bold mt-4">Importer les données</h3>
		<p class="py-4">
			Collez le code qui vous a été partagé pour importer un état de landsraad et le
			visualiser/modifier.
		</p>
		<textarea class="textarea w-full" v-model="importCodeEl"></textarea>
		<div class="modal-action">
			<form method="dialog" class="w-full">
				<button class="btn btn-primary w-full" @click="updateCode">Importer</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</template>

<script setup>
import { ref } from 'vue';
import { useLandsraadStore } from '@/stores/landsraad';

defineProps(['exportHousesCode']);

const landsraad = useLandsraadStore();

const importCodeEl = ref();

const updateCode = () => {
	landsraad.handleImportHouses(importCodeEl.value);
	importCodeEl.value = '';
};
</script>
