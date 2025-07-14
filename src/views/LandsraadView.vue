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
				<div class="inline-flex gap-2 items-center" v-if="editMode">
					<InfoCircleIcon class="size-5 shrink-0" />
					<span class="text-sm"
						>Clic gauche dans la case&nbsp;= gagné&nbsp;; clic droit (ou appui long sur
						mobile)&nbsp;= perdu.</span
					>
				</div>
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
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<h3 class="text-xl font-bold text-primary">Partager votre code</h3>
			<p class="py-4">
				Diffusez le code suivant pour partager l'état actuel de votre landsraad avec
				d'autres personnes.
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
	</dialog>
	<dialog ref="listModal" class="modal">
		<div class="modal-box max-h-[90dvh]">
			<h3 class="text-xl font-bold text-primary">Liste des objets possibles</h3>
			<table class="table table-sm mt-4">
				<thead>
					<tr>
						<th>Objet</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in items" :key="item.pk">
						<td>
							<div class="inline-flex gap-2 items-center">
								<img
									:src="`/img/items/${item.fields.icon}`"
									class="size-6"
									alt=""
									v-if="item.fields.icon"
								/>
								{{ item.fields.name }}
							</div>
						</td>
						<td class="text-end">
							{{
								item.fields.landsraad_points
									? `${item.fields.landsraad_points} pts`
									: '???'
							}}
						</td>
					</tr>
				</tbody>
			</table>
			<div class="modal-action">
				<form method="dialog" class="w-full">
					<button class="btn btn-primary w-full">Fermer</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<dialog class="modal" ref="houseModal">
		<div class="modal-box max-w-sm" v-if="currentHouse">
			<!-- <pre>{{ currentHouse }}</pre> -->
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div class="flex flex-col items-center">
				<img
					:src="`/img/houses/${currentHouse.name}.webp`"
					alt=""
					class="size-32 object-contain z-20"
				/>
				<h4 class="text-xl font-bold">{{ currentHouse.name }}</h4>
				<div class="text-center" v-if="currentHouse.wish?.data">
					<RouterLink
						:to="{ name: 'item', params: { slug: currentHouse.wish.data.fields.slug } }"
						class="group"
						v-if="currentHouse.wish.type === 'item'"
					>
						Livrer&nbsp;:
						<span class="group-hover:underline">
							{{ currentHouse.wish.data.fields.name }}
							<template v-if="currentHouse.wish?.data.fields.landsraad_points">
								<br /><small
									><em
										>{{
											currentHouse.wish.data.fields.landsraad_points
										}}&nbsp;points/unité</em
									></small
								>
							</template>
						</span>
					</RouterLink>
					<span v-else-if="currentHouse.wish.type === 'kill'">
						Tuer&nbsp;: {{ currentHouse.wish.data.name }} <br /><small
							><em>{{ kills_points }}&nbsp;pts/u</em></small
						>
					</span>
				</div>
				<div class="flex flex-col gap-3 mt-4 w-full" v-if="currentHouse.wish">
					<label class="flex gap-2 items-center justify-center select-none">
						<input
							type="checkbox"
							class="toggle toggle-primary toggle-sm"
							v-model="currentHouse.user.picked"
							:disabled="currentHouse.user.step === 0"
							@change="handleUpdatePicked"
						/>
						Récompenses récupérées
					</label>
					<div
						v-if="
							currentHouse.wish.type === 'item' &&
							currentHouse.wish.data.fields.landsraad_points
						"
					>
						<table class="table table-sm">
							<thead>
								<tr>
									<th colspan="3">Palier</th>
									<th class="text-end">Qt</th>
									<th class="text-end">Total</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(step, s) in steps_points"
									:key="s"
									class="hover:bg-base-300 cursor-pointer"
									@click="handleUpdateStep(currentHouse.id, s + 1)"
								>
									<td width="1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="icon icon-tabler icons-tabler-filled icon-tabler-square-check size-5"
											:class="{
												'text-base-content opacity-50':
													currentHouse.user.step < s + 1,
												'text-success': currentHouse.user.step >= s + 1,
											}"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path
												d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
											/>
										</svg>
									</td>
									<td width="1">{{ s + 1 }}</td>
									<td class="text-end" width="1">{{ step }}&nbsp;pts</td>
									<td class="text-end font-bold text-primary text-shadow">
										&times;&nbsp;{{
											Math.ceil(
												step /
													currentHouse.wish.data.fields.landsraad_points,
											)
										}}
									</td>
									<td class="text-end">
										{{
											currentHouse.wish.data.fields.landsraad_points *
											Math.ceil(
												step /
													currentHouse.wish.data.fields.landsraad_points,
											)
										}}&nbsp;pts
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div v-if="currentHouse.wish.type === 'kill'">
						<table class="table table-sm">
							<thead>
								<tr>
									<th colspan="3">Palier</th>
									<th class="text-end">Qt</th>
									<th class="text-end">Total</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(step, s) in steps_points"
									:key="s"
									class="hover:bg-base-300 cursor-pointer"
									@click="handleUpdateStep(currentHouse.id, s + 1)"
								>
									<td width="1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="icon icon-tabler icons-tabler-filled icon-tabler-square-check size-5"
											:class="{
												'text-base-content opacity-50':
													currentHouse.user.step < s + 1,
												'text-success': currentHouse.user.step >= s + 1,
											}"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path
												d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
											/>
										</svg>
									</td>
									<td width="1">{{ s + 1 }}</td>
									<td class="text-end" width="1">{{ step }}&nbsp;pts</td>
									<td class="text-end font-bold text-primary text-shadow">
										&times;&nbsp;{{ Math.ceil(step / kills_points) }}
									</td>
									<td class="text-end">
										{{ kills_points * Math.ceil(step / kills_points) }}&nbsp;pts
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<a
					v-if="currentHouse.location?.url"
					:href="currentHouse.location.url"
					class="btn btn-primary btn-block mt-4"
					target="_blank"
					rel="nofollow"
				>
					Localiser le représentant
				</a>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
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
const landsraad = useLandsraadStore();
const { handleUpdateStep, handleUpdatePicked, kills_points, steps_points } = landsraad;
const { houses, items, editMode, exportHousesCode } = storeToRefs(landsraad);

const houseModal = ref();
const exportImportModal = ref();
const listModal = ref();

const el = ref();

const importCodeEl = ref();
const currentHouse = ref({});

const updateCode = () => {
	landsraad.handleImportHouses(importCodeEl.value);
	importCodeEl.value = '';
};

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
