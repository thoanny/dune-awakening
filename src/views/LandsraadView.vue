<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<!-- Tippy -->
		<tippy ref="miniMenu" trigger="manual" :follow-cursor="false" :interactive="true">
			<template #content>
				<div
					class="bg-base-300 rounded-box w-56 py-3 shadow-2xl shadow-base-content/50"
					v-if="currentHouse && !isMiniMenuLoading"
				>
					<h4 class="flex gap-2 items-center font-bold mx-2 justify-center">
						<img
							:src="`/img/houses/${currentHouse.name}.webp`"
							alt=""
							class="size-8 object-contain z-20"
						/>
						{{ currentHouse.name }}
						<img
							:src="`/img/houses/${currentHouse.name}.webp`"
							alt=""
							class="size-8 object-contain z-20"
						/>
					</h4>

					<div class="divider text-sm my-3 text-base-content/75 font-semibold">
						Paliers validés
					</div>
					<div class="flex gap-1 justify-center" v-if="currentHouse.user">
						<button
							class="btn btn-square btn-sm"
							v-for="(step, s) in steps_points"
							:key="s"
							:class="{
								'btn-outline': currentHouse.user.step < s + 1,
								'btn-success': currentHouse.user.step >= s + 1,
							}"
							:style="
								currentHouse.user.step < s + 1
									? '--btn-color: color-mix(in oklab, var(--color-base-content) 50%, transparent);'
									: ''
							"
							@click="handleUpdateStep(currentHouse.id, s + 1)"
						>
							{{ s + 1 }}
						</button>
					</div>
					<div class="divider text-sm my-3 text-base-content/75 font-semibold">
						Récompenses
					</div>
					<label
						class="flex gap-2 items-center justify-center select-none text-sm"
						v-if="currentHouse.user"
					>
						<input
							type="checkbox"
							class="toggle toggle-success toggle-sm"
							v-model="currentHouse.user.picked"
							:disabled="currentHouse.user.step === 0"
							@change="handleUpdatePicked"
						/>
						Récupérées
					</label>
					<div class="divider text-sm my-3 text-base-content/75 font-semibold">
						Statut
					</div>
					<div class="grid grid-cols-2 gap-2 mx-3">
						<button
							class="btn btn-success btn-sm btn-wide"
							:class="{
								'btn-outline': currentHouse.status !== 'w',
							}"
							@click="handleUpdateStatus(currentHouse.id, 'w')"
						>
							Atréides
						</button>
						<button
							class="btn btn-error btn-sm btn-wide"
							:class="{
								'btn-outline': currentHouse.status !== 'l',
							}"
							@click="handleUpdateStatus(currentHouse.id, 'l')"
						>
							Harkonnen
						</button>
					</div>
				</div>
				<div class="h-[260px] w-56" v-else></div>
			</template>
		</tippy>
		<!-- /Tippy -->
		<div
			class="px-4 mt-4 flex flex-col md:flex-row items-center justify-between gap-x-4 gap-y-2"
		>
			<div class="flex items-center gap-2">
				<button @click="helpModal.showModal()" class="btn leading-none btn-primary">
					<InfoCircleIcon class="size-5" />
					Aide
				</button>
			</div>
			<div class="flex flex-wrap justify-center items-center gap-2">
				<button class="btn btn-primary leading-none" @click="exportImportModal.showModal()">
					<DeviceFloppyIcon class="size-6" />
					Exporter/Importer
				</button>
				<button class="btn btn-primary leading-none" @click="landsraad.handleReset">
					<ArrowBackUpIcon class="size-6" />
					Réinitialiser
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
				@click="handleMiniMenu(house.id, $event)"
			/>
		</div>
	</div>
	<dialog ref="helpModal" class="modal">
		<LandsraadHelpModal />
	</dialog>
	<dialog ref="exportImportModal" class="modal">
		<ExportImportModal :export-houses-code="exportHousesCode" />
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
import DeviceFloppyIcon from '@/icons/DeviceFloppyIcon.vue';
import ArrowBackUpIcon from '@/icons/ArrowBackUpIcon.vue';
import ExportImportModal from '@/components/modals/LandsraadExportImportModal.vue';
import LandsraadHelpModal from '@/components/modals/LandsraadHelpModal.vue';

const landsraad = useLandsraadStore();
const { steps_points, handleUpdateStep, handleUpdatePicked, handleUpdateStatus } = landsraad;
const { houses, currentHouse, exportHousesCode } = storeToRefs(landsraad);

const exportImportModal = ref();
const helpModal = ref();

const el = ref();
const miniMenu = ref();

const isMiniMenuLoading = ref();

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

const handleMiniMenu = (houseId, $event) => {
	$event.preventDefault();

	isMiniMenuLoading.value = true;
	currentHouse.value = houses.value.find((house) => house.id === houseId);

	miniMenu.value.setProps({
		getReferenceClientRect: () => ({
			width: 0,
			height: 0,
			top: $event.clientY,
			bottom: $event.clientY,
			left: $event.clientX,
			right: $event.clientX,
		}),
	});

	setTimeout(() => {
		isMiniMenuLoading.value = false;
		miniMenu.value.show();
	}, 50);
};
</script>
