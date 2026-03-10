<template>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-xl font-bold text-primary">Partager votre code</h3>
		<p class="py-4">
			Diffusez le code suivant pour partager l'état actuel de votre landsraad avec d'autres
			personnes (statut&nbsp;: Atréides/Harkonnen&nbsp;; ordre d'apparition dans le tableau).
		</p>
		<p
			class="break-all text-xs border border-white/25 p-2"
			:class="{ 'select-none': isSupported }"
		>
			{{ exportHousesCode }}
		</p>
		<div v-if="isSupported">
			<button @click="copy()" class="btn btn-primary btn-block mt-4">
				<template v-if="!copied"> <IconClipboard /> Copier le code</template>
				<template v-else> <IconClipboardCheck /> Code copié !</template>
			</button>
		</div>
		<h3 class="text-xl text-primary font-bold mt-4">Importer les données</h3>
		<p class="py-4">
			Collez le code qui vous a été partagé pour importer un état de landsraad. Cela n'affecte
			pas votre progression&nbsp;: paliers validés et récompenses récupérées.
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
import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import IconClipboard from '@/icons/IconClipboard.vue';
import IconClipboardCheck from '@/icons/IconClipboardCheck.vue';

const landsraad = useLandsraadStore();
const { exportHousesCode } = storeToRefs(landsraad);

const importCodeEl = ref();

const updateCode = () => {
	landsraad.handleImportHouses(importCodeEl.value);
	importCodeEl.value = '';
};

const { copy, copied, isSupported } = useClipboard({ source: exportHousesCode });
</script>
