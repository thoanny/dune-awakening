<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<div
			class="px-4 mt-4 flex flex-col xl:flex-row items-center justify-between gap-x-4 gap-y-2"
		>
			<div class="flex items-center gap-2">
				<button
					@click="
						() => {
							editMode = !editMode;
							display = 'grid';
						}
					"
					class="btn leading-none"
					:class="{ 'btn-primary': !editMode, 'btn-neutral': editMode }"
				>
					<EditIcon class="size-5" v-if="!editMode" />
					<XIcon class="size-5" v-else />
					Modifier
				</button>
				<button @click="helpModal.showModal()" class="btn leading-none btn-primary">
					<InfoCircleIcon class="size-5" />
					Aide
				</button>
				<button
					@click="switchDisplay()"
					class="btn leading-none btn-primary"
					:disabled="editMode"
				>
					<LayoutGridIcon class="size-5" v-if="display === 'grid'" />
					<ListDetailsIcon class="size-5" v-else />
					{{ display === 'grid' ? 'Grille' : 'Liste' }}
				</button>
			</div>
			<div class="flex flex-wrap justify-center items-center gap-2">
				<button
					class="btn btn-primary leading-none"
					@click="exportImportModal.showModal()"
					:disabled="editMode"
				>
					<DeviceFloppyIcon class="size-6" />
					Exporter/Importer
				</button>
				<button
					class="btn btn-primary leading-none"
					@click="landsraad.handleReset"
					:disabled="editMode"
				>
					<ArrowBackUpIcon class="size-6" />
					Réinitialiser
				</button>
				<button
					class="btn btn-primary leading-none"
					@click="listModal.showModal()"
					:disabled="editMode"
				>
					<ListCheckIcon class="size-6" />
					Objets possibles
				</button>
			</div>
		</div>
		<div
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4 select-none"
			ref="el"
			v-show="display === 'grid'"
		>
			<HouseTile
				v-for="house in houses"
				:key="house.id"
				:house="house"
				@open-modal="handleOpenModal"
			/>
		</div>
		<div class="mt-4 px-4" v-show="display === 'list'">
			<div class="flex items-center gap-3">
				<input
					type="range"
					min="0"
					:max="BONUSMAX"
					class="range range-sm range-primary"
					v-model="bonusLevel"
					@change="handleLocalBonusLevel"
				/>
				<label class="text-left whitespace-nowrap w-28 shrink-0"
					>Bonus de {{ bonusLevel * 20 }} %</label
				>
			</div>
			<div class="mt-4">
				<table class="table table-sm whitespace-nowrap table-pin-rows select-none">
					<thead class="">
						<tr class="bg-base-300">
							<th>Maison</th>
							<th>Souhait</th>
							<th class="text-center">Pts/u</th>
							<th class="text-center" v-for="(step, s) in steps_points" :key="s">
								P{{ s + 1 }}
							</th>
							<th width="1">Progression</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="house in filteredHouses"
							:key="house.id"
							:class="{
								'opacity-10': !house.wish_id,
								'hover:bg-base-300': house.wish_id && activeRow !== house.id,
								'bg-secondary/50': activeRow === house.id,
							}"
							@click="handleRowActive(house.id)"
						>
							<td>
								<div class="flex gap-2 items-center">
									<img
										:src="`/img/houses/${house.name}.webp`"
										class="size-7 shrink-0"
										alt=""
									/>
									<span class="font-bold">{{ house.name }}</span>
								</div>
							</td>
							<td>
								<tippy v-if="house.wish.type === 'item'" class="font-semibold">
									<RouterLink
										:to="{
											name: 'item',
											params: { slug: house.wish.data?.fields.slug },
										}"
										class="inline-flex gap-1 items-center"
									>
										<img
											v-if="house.wish.data?.fields.icon"
											:src="`/img/items/${house.wish.data.fields.icon}`"
											class="size-7"
											alt=""
										/>{{ house.wish.data?.fields.name }}</RouterLink
									>
									<template #content>
										<ItemTooltip :item="house.wish.data" v-if="house.wish" />
									</template>
								</tippy>
								<span class="font-semibold" v-else-if="house.wish.type === 'kill'">
									Tuer&nbsp;: {{ house.wish.data?.name }}
								</span>
								<span v-else>---</span>
							</td>
							<td class="text-center">
								<template v-if="house.wish?.type === 'kill'">
									{{ Math.round(kills_points * coef) }}
								</template>
								<template v-else-if="house.wish?.type === 'item'">
									{{
										house.wish.data?.fields?.landsraad_points
											? Math.round(
													house.wish.data.fields.landsraad_points * coef,
												)
											: '???'
									}}
								</template>
								<template v-else>???</template>
							</td>
							<td class="text-center" v-for="(step, s) in steps_points" :key="s">
								<template
									v-if="
										house.wish.type === 'item' &&
										house.wish?.data?.fields?.landsraad_points
									"
								>
									{{
										Math.ceil(
											step / (house.wish.data.fields.landsraad_points * coef),
										)
									}}
								</template>
								<template v-else-if="house.wish.type === 'kill'">
									{{ Math.ceil(step / (kills_points * coef)) }}
								</template>
								<template v-else>???</template>
							</td>
							<td>
								<div class="flex gap-1">
									<button
										v-for="(step, s) in steps_points"
										:key="s"
										class="btn btn-sm btn-square"
										:class="{
											'opacity-50 hover:opacity-100 btn-outline border-base-content':
												house.user.step < s + 1,
											'btn-success': house.user.step >= s + 1,
										}"
										@click="handleUpdateStep(house.id, s + 1)"
									>
										{{ s + 1 }}
									</button>
									<button
										class="btn btn-sm btn-square"
										:class="{
											'btn-primary': !house.user.picked,
											'btn-success': house.user.picked,
										}"
										:disabled="house.user.step === 0"
										@click="handleUpdatePicked(house.id)"
									>
										<GiftIcon class="size-5" />
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- <pre>{{ houses }}</pre> -->
		</div>
	</div>
	<dialog ref="helpModal" class="modal">
		<LandsraadHelpModal />
	</dialog>
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
import { ref, computed } from 'vue';
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
import LandsraadHelpModal from '@/components/modals/LandsraadHelpModal.vue';

import ItemTooltip from '@/components/ItemTooltip.vue';
import GiftIcon from '@/icons/GiftIcon.vue';
import LayoutGridIcon from '@/icons/LayoutGridIcon.vue';
import ListDetailsIcon from '@/icons/ListDetailsIcon.vue';

const landsraad = useLandsraadStore();
const {
	kills_points,
	steps_points,
	BONUSMAX,
	handleUpdateStep,
	handleUpdatePicked,
	handleLocalBonusLevel,
} = landsraad;
const { houses, currentHouse, editMode, exportHousesCode, bonusLevel } = storeToRefs(landsraad);

const display = ref('grid');
const houseModal = ref();
const exportImportModal = ref();
const listModal = ref();
const helpModal = ref();

const activeRow = ref(null);

const el = ref();

const handleOpenModal = (houseId) => {
	if (editMode.value) {
		return;
	}
	currentHouse.value = houses.value.find((house) => house.id === houseId);
	houseModal.value.showModal();
};

const handleRowActive = (houseId) => {
	activeRow.value = activeRow.value === houseId ? null : houseId;
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

const switchDisplay = () => {
	display.value = display.value === 'grid' ? 'list' : 'grid';
};

const coef = computed(() => {
	return 1 + (bonusLevel.value * 20) / 100;
});

const filteredHouses = computed(() => {
	return JSON.parse(JSON.stringify(houses.value)).sort((a, b) => a.name.localeCompare(b.name));
});
</script>
