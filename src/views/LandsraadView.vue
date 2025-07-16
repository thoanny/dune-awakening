<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<div
			class="px-4 mt-4 flex flex-col xl:flex-row items-center justify-between gap-x-4 gap-y-2"
		>
			<div class="flex items-center gap-4">
				<button
					@click="editMode = !editMode"
					class="btn leading-none"
					:class="{ 'btn-primary': !editMode, 'btn-neutral': editMode }"
				>
					<EditIcon class="size-5" v-if="!editMode" />
					<XIcon class="size-5" v-else />
					Modifier
				</button>

				<!-- <div class="inline-flex gap-2 items-center" v-if="editMode">
					<InfoCircleIcon class="size-5 shrink-0" />
					<span class="text-sm"
						>Clic gauche dans la case&nbsp;= gagné&nbsp;; clic droit (ou appui long sur
						mobile)&nbsp;= perdu.</span
					>
				</div> -->
			</div>
			<div class="flex flex-wrap justify-center items-center gap-2">
				<button
					class="btn btn-primary"
					@click="exportImportModal.showModal()"
					:disabled="editMode"
				>
					<DeviceFloppyIcon class="size-6" />
					Exporter/Importer
				</button>
				<button class="btn btn-primary" @click="landsraad.handleReset" :disabled="editMode">
					<ArrowBackUpIcon class="size-6" />
					Réinitialiser
				</button>
				<button class="btn btn-primary" @click="listModal.showModal()" :disabled="editMode">
					<ListCheckIcon class="size-6" />
					Objets possibles
				</button>
			</div>
		</div>
		<div
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4 select-none"
			ref="el"
		>
			<HouseTile
				v-for="house in houses"
				:key="house.id"
				:house="house"
				@open-modal="handleOpenModal"
			/>
		</div>
	</div>
	<dialog ref="exportImportModal" class="modal">
		<ExportImportModal :export-houses-code="exportHousesCode" />
	</dialog>

	<dialog ref="listModal" class="modal">
		<LandsraadListModal />
	</dialog>
	<dialog class="modal" ref="houseModal">
		<LandsraadHouseModal />
	</dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useDraggable } from 'vue-draggable-plus';
import TitleSection from '@/components/TitleSection.vue';
import HouseTile from '@/components/HouseTile.vue';
import InfoCircleIcon from '@/icons/InfoCircleIcon.vue';

import { useLandsraadStore } from '@/stores/landsraad';
import { storeToRefs } from 'pinia';
import EditIcon from '@/icons/EditIcon.vue';
import XIcon from '@/icons/XIcon.vue';
import DeviceFloppyIcon from '@/icons/DeviceFloppyIcon.vue';
import ArrowBackUpIcon from '@/icons/ArrowBackUpIcon.vue';
import ListCheckIcon from '@/icons/ListCheckIcon.vue';
import ExportImportModal from '@/components/modals/LandsraadExportImportModal.vue';
import LandsraadListModal from '@/components/modals/LandsraadListModal.vue';
import LandsraadHouseModal from '@/components/modals/LandsraadHouseModal.vue';
const landsraad = useLandsraadStore();
const { houses, currentHouse, editMode, exportHousesCode } = storeToRefs(landsraad);

const houseModal = ref();
const exportImportModal = ref();
const listModal = ref();

const el = ref();

const handleOpenModal = (houseId) => {
	if (editMode.value) {
		return;
	}
	currentHouse.value = houses.value.find((house) => house.id === houseId);
	houseModal.value.showModal();
};

/*

Cryshah :
- Début du landsraad : lundi 19h UTC
- Fin du landsraad : dimanche 19h UTC
- 5 tuiles : du mardi au samedi à 17h UTC
- Limite des récompenses : début du prochain landsraad

Discord officiel :
- New term starts: mardi 24 juin 2025 à 05:00 (Europe/Paris)
- Voting session starts: dimanche 29 juin 2025 à 20:00 (Europe/Paris)
- Voting session ends: lundi 23 juin 2025 à 20:00 (Europe/Paris)

*/

useDraggable(el, houses, {
	animation: 150,
	handle: '.handle',
	onUpdate() {
		landsraad.handleUpdateSort();
	},
});
</script>
