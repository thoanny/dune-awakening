<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<div class="px-4 mt-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<button
					@click="editMode = !editMode"
					class="btn leading-none"
					:class="{ 'btn-primary': !editMode, 'btn-neutral': editMode }"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-edit size-5"
						v-if="!editMode"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
						<path
							d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
						/>
						<path d="M16 5l3 3" />
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-x size-5"
						v-else
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M18 6l-12 12" />
						<path d="M6 6l12 12" />
					</svg>
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
			<div class="flex items-center gap-2">
				<button class="btn btn-primary btn-square" @click="exportModal.showModal()">
					<ShareIcon class="size-5" />
				</button>
				<button class="btn btn-primary btn-square" @click="importModal.showModal()">
					<DownloadIcon class="size-5" />
				</button>
				<button class="btn btn-primary btn-square" @click="handleResetMyWorldHouses">
					<BombIcon class="size-5" />
				</button>
				<button class="btn btn-primary btn-square" @click="listModal.showModal()">
					<ListIcon class="size-5" />
				</button>
			</div>
		</div>
		<div class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4 select-none" ref="el">
			<HouseTile
				v-for="house in myWorldHouses"
				:key="house.id"
				:house="house"
				:user="getUserHouse(house.id)"
				:edit-mode="editMode"
				@house-win="handleHouseWin"
				@house-lost="handleHouseLost"
				@change-wish="handleChangeWish"
				@show-details="handleShowHouseDetails"
			/>
		</div>
	</div>
	<dialog ref="exportModal" class="modal">
		<div class="modal-box">
			<h3 class="text-xl font-bold text-primary">Partager votre code</h3>
			<p class="py-4">
				Diffusez le code suivant pour partager l'état actuel de votre landsraad avec
				d'autres personnes.
			</p>
			<p class="break-all text-xs border border-white/25 p-2">{{ exportCode }}</p>
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
					<tr v-for="item in filteredItems" :key="item.pk">
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
	<dialog ref="importModal" class="modal">
		<div class="modal-box">
			<h3 class="text-xl text-primary font-bold">Importer les données</h3>
			<p class="py-4">
				Collez le code qui vous a été partagé pour importer un état de landsraad et le
				visualiser/modifier.
			</p>
			<textarea class="textarea w-full" v-model="codeEl"></textarea>
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
	<dialog class="modal" ref="houseModal">
		<div class="modal-box max-w-sm" v-if="currentHouse">
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
				<div class="text-center" v-if="currentHouseWish">
					<RouterLink
						:to="{ name: 'item', params: { slug: currentHouseWish.fields.slug } }"
						class="group"
						v-if="currentHouse.wish > 0"
					>
						Livrer&nbsp;:
						<span class="group-hover:underline">
							{{ currentHouseWish.fields.name }}
						</span>
					</RouterLink>
					<span v-else-if="currentHouse.wish < 0">
						Tuer&nbsp;: {{ currentHouseWish.name }}
					</span>
				</div>
				<div class="flex flex-col gap-3 mt-4 w-full" v-if="currentHouse.wish">
					<label class="flex gap-2 items-center justify-center select-none">
						<input
							type="checkbox"
							class="toggle toggle-primary toggle-sm"
							v-model="currentHouse.picked"
							:disabled="currentHouse.step == 0"
							@change="handleTogglePicked"
						/>
						Récompenses récupérées
					</label>
					<div
						v-if="
							currentHouseWish &&
							currentHouseWish.type === 'delivery' &&
							currentHouseWish.fields.landsraad_points
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
									@click="updateCurrentHouseStep(s + 1)"
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
													currentHouse.step < s + 1,
												'text-success': currentHouse.step >= s + 1,
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
												step / currentHouseWish.fields.landsraad_points,
											)
										}}
									</td>
									<td class="text-end">
										{{
											currentHouseWish.fields.landsraad_points *
											Math.ceil(
												step / currentHouseWish.fields.landsraad_points,
											)
										}}&nbsp;pts
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div v-if="currentHouseWish && currentHouseWish.type === 'kill'">
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
									@click="updateCurrentHouseStep(s + 1)"
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
													currentHouse.step < s + 1,
												'text-success': currentHouse.step >= s + 1,
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
					v-if="getLocation(currentHouse.id)"
					:href="getLocation(currentHouse.id)"
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
import { ref, onMounted, watch, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useDraggable } from 'vue-draggable-plus';
import LZString from 'lz-string';
import TitleSection from '@/components/TitleSection.vue';
import HouseTile from '@/components/HouseTile.vue';
import InfoCircleIcon from '@/icons/InfoCircleIcon.vue';
import ShareIcon from '@/icons/ShareIcon.vue';
import DownloadIcon from '@/icons/DownloadIcon.vue';
import BombIcon from '@/icons/BombIcon.vue';
import ListIcon from '@/icons/ListIcon.vue';

const store = useAppStore();
const { items, kills } = store;

const importModal = ref();
const exportModal = ref();
const listModal = ref();
const el = ref();
const myWorldHouses = ref([]);
const editMode = ref(false);
const exportCode = ref('');
const codeEl = ref();
const currentHouse = ref({});
const currentHouseWish = ref(null);
const houseModal = ref();

const updateCode = () => {
	myWorldHouses.value = JSON.parse(
		LZString.decompressFromEncodedURIComponent(codeEl.value.trim()),
	);
	codeEl.value = '';
	return;
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

const handleHouseLost = (houseId) => {
	const idx = myWorldHouses.value.findIndex((house) => house.id === houseId);
	if (idx < 0) {
		return;
	}

	myWorldHouses.value[idx].status = myWorldHouses.value[idx].status === 'lost' ? null : 'lost';
	saveMyWorldHouses();
};

const handleHouseWin = (houseId) => {
	const idx = myWorldHouses.value.findIndex((house) => house.id === houseId);
	if (idx < 0) {
		return;
	}

	myWorldHouses.value[idx].status = myWorldHouses.value[idx].status === 'win' ? null : 'win';
	saveMyWorldHouses();
};

const handleResetMyWorldHouses = () => {
	if (confirm('Vous voulez réinitialiser les données ?') == true) {
		initHousesData();
		localStorage.removeItem('landsraad');
		localStorage.removeItem('landsraad-user');
		saveMyWorldHouses();
	}
};

const handleChangeWish = (houseId, wish) => {
	const idx = myWorldHouses.value.findIndex((house) => house.id === houseId);
	if (idx < 0) {
		return;
	}

	if (myWorldHouses.value[idx].wish === wish) {
		return;
	}

	myWorldHouses.value[idx].wish = wish;
	myWorldHouses.value[idx].step = 0;
	saveMyWorldHouses();
};

useDraggable(el, myWorldHouses, {
	animation: 150,
	handle: '.handle',
	onStart() {},
	onUpdate() {
		saveMyWorldHouses();
	},
});

const myHouses = ref([]);

const houses = [
	{ id: '1', name: 'Alexin', wish: '', status: null },
	{ id: '2', name: 'Argosaz', wish: '', status: null },
	{ id: '3', name: 'Dyvetz', wish: '', status: null },
	{ id: '4', name: 'Ecaz', wish: '', status: null },
	{ id: '5', name: 'Hagal', wish: '', status: null },
	{ id: '6', name: 'Hurata', wish: '', status: null },
	{ id: '7', name: 'Imota', wish: '', status: null },
	{ id: '8', name: 'Kenola', wish: '', status: null },
	{ id: '9', name: 'Lindaren', wish: '', status: null },
	{ id: '10', name: 'Maros', wish: '', status: null },
	{ id: '11', name: 'Mikarrol', wish: '', status: null },
	{ id: '12', name: 'Moritani', wish: '', status: null },
	{ id: '13', name: 'Mutelli', wish: '', status: null },
	{ id: '14', name: 'Novebruns', wish: '', status: null },
	{ id: '15', name: 'Richèse', wish: '', status: null },
	{ id: '16', name: 'Sor', wish: '', status: null },
	{ id: '17', name: 'Spinette', wish: '', status: null },
	{ id: '18', name: 'Taligari', wish: '', status: null },
	{ id: '19', name: 'Thorvald', wish: '', status: null },
	{ id: '20', name: 'Tseida', wish: '', status: null },
	{ id: '21', name: 'Varota', wish: '', status: null },
	{ id: '22', name: 'Vernius', wish: '', status: null },
	{ id: '23', name: 'Wallach', wish: '', status: null },
	{ id: '24', name: 'Wayku', wish: '', status: null },
	{ id: '25', name: 'Wydras', wish: '', status: null },
];

const housesLocation = [
	{ id: '1', url: 'https://mapgenie.io/dune-awakening/maps/harko-village?locationIds=460783' },
	{ id: '2', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=459766' },
	{ id: '3', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460431' },
	{ id: '4', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460696' },
	{ id: '5', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460534' },
	{ id: '6', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=446876' },
	{ id: '7', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460736' },
	{ id: '8', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460730' },
	{ id: '9', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460918' },
	{ id: '10', url: '' },
	{ id: '11', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460608' },
	{ id: '12', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460697' },
	{ id: '13', url: 'https://mapgenie.io/dune-awakening/maps/arrakeen?locationIds=460830' },
	{ id: '14', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=446917' },
	{ id: '15', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460724' },
	{ id: '16', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460523' },
	{ id: '17', url: 'https://mapgenie.io/dune-awakening/maps/harko-village?locationIds=460781' },
	{ id: '18', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460568' },
	{ id: '19', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460436' },
	{ id: '20', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=446889' },
	{ id: '21', url: 'https://mapgenie.io/dune-awakening/maps/arrakeen?locationIds=460843' },
	{ id: '22', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460723' },
	{ id: '23', url: '' },
	{ id: '24', url: '' },
	{ id: '25', url: 'https://mapgenie.io/dune-awakening/maps/arrakis?locationIds=460637' },
];

const getLocation = (houseId) => {
	return housesLocation.find((house) => house.id === houseId)?.url;
};

const initHousesData = () => {
	myWorldHouses.value = JSON.parse(JSON.stringify(houses));
	myHouses.value = JSON.parse(JSON.stringify(houses))
		.map((house) => {
			delete house.name;
			delete house.wish;
			delete house.status;
			return { ...house, step: 0, picked: false };
		})
		.sort((a, b) => a.id - b.id);
};

onMounted(() => {
	initHousesData();
	const localLandsraad = JSON.parse(localStorage.getItem('landsraad'));
	if (localLandsraad) {
		myWorldHouses.value = localLandsraad;
	}
	const localUserLandsraad = JSON.parse(localStorage.getItem('landsraad-user'));
	if (localUserLandsraad) {
		myHouses.value = localUserLandsraad;
	}
});

const saveMyWorldHouses = () => {
	if (myWorldHouses.value.length > 0) {
		const localHouses = JSON.parse(JSON.stringify(myWorldHouses.value));
		localStorage.setItem('landsraad', JSON.stringify(localHouses));
	}

	if (myHouses.value.length > 0) {
		const localUserHouses = JSON.parse(JSON.stringify(myHouses.value));
		localStorage.setItem('landsraad-user', JSON.stringify(localUserHouses));
	}

	exportCode.value = LZString.compressToEncodedURIComponent(JSON.stringify(myWorldHouses.value));
};

saveMyWorldHouses();

watch(myWorldHouses, async () => {
	saveMyWorldHouses();
});

const updateCurrentHouse = (houseId) => {
	const house = myWorldHouses.value.find((house) => house.id === houseId);
	const userHouse = myHouses.value.find((house) => house.id === houseId);
	currentHouse.value = { ...house, ...userHouse };
	if (house?.wish > 0) {
		currentHouseWish.value = {
			type: 'delivery',
			...items.find((item) => item.pk === house.wish),
		};
	} else if (house?.wish < 0) {
		currentHouseWish.value = {
			type: 'kill',
			...kills.find((kill) => kill.id === house.wish),
		};
	} else {
		currentHouseWish.value = null;
	}
};

const handleShowHouseDetails = (houseId) => {
	if (editMode.value) {
		return;
	}
	updateCurrentHouse(houseId);
	houseModal.value.showModal();
};

const kills_points = 23;
const steps_points = [700, 3500, 7000, 10500, 14000];

const updateCurrentHouseStep = (step) => {
	const idx = myHouses.value.findIndex((house) => house.id === currentHouse.value.id);
	if (idx >= 0) {
		myHouses.value[idx].picked = false;
		myHouses.value[idx].step = myHouses.value[idx].step === step ? 0 : step;
		updateCurrentHouse(currentHouse.value.id);
	}

	saveMyWorldHouses();
};

const getUserHouse = (houseId) => {
	return myHouses.value.find((house) => house.id === houseId);
};

const handleTogglePicked = () => {
	const idx = myHouses.value.findIndex((house) => house.id === currentHouse.value.id);
	if (idx >= 0) {
		myHouses.value[idx].picked = currentHouse.value.picked;
	}
	saveMyWorldHouses();
};

const filteredItems = computed(() => {
	return items
		.filter((item) => item.fields?.landsraad === true)
		.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
});
</script>
