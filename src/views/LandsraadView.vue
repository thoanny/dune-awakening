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
			</div>
		</div>
		<div class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4 select-none" ref="el">
			<HouseTile
				v-for="house in myWorldHouses"
				:key="house.id"
				:house="house"
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
				<div v-if="currentHouse._wish">
					<RouterLink
						:to="{ name: 'item', params: { slug: currentHouse._wish.fields.slug } }"
						class="group"
						v-if="currentHouse.wish > 0"
					>
						Livrer&nbsp;:
						<span class="group-hover:underline">
							{{ currentHouse._wish.fields.name }}
						</span>
					</RouterLink>
					<span v-else-if="currentHouse.wish < 0">
						Tuer&nbsp;: {{ currentHouse._wish.name }}
					</span>
				</div>
				<div class="flex flex-col gap-3 mt-4 w-full" v-if="currentHouse.wish">
					<div class="flex gap-4 items-center">
						<input
							type="range"
							min="0"
							max="5"
							v-model="currentHouse.step"
							class="range w-full"
							:class="{ 'range-primary': currentHouse.step > 0 }"
							@change="handleUpdateStep(currentHouse.id)"
						/>
						<span class="whitespace-nowrap"
							>Palier <strong>{{ currentHouse.step }}</strong> terminé</span
						>
					</div>
					<label class="flex gap-2 items-center select-none">
						<input
							type="checkbox"
							class="toggle toggle-primary"
							v-model="currentHouse.picked"
							:disabled="currentHouse.step == 0"
							@change="saveMyWorldHouses"
						/>
						Récompenses récupérées
					</label>
				</div>
				<a
					v-if="getLocation(currentHouse.id)"
					:href="getLocation(currentHouse.id)"
					class="btn btn-primary btn-block mt-4"
					target="_blank"
					rel="nofollow"
				>
					Localisation
				</a>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { useDraggable } from 'vue-draggable-plus';
import LZString from 'lz-string';
import TitleSection from '@/components/TitleSection.vue';
import HouseTile from '@/components/HouseTile.vue';
import InfoCircleIcon from '@/icons/InfoCircleIcon.vue';
import ShareIcon from '@/icons/ShareIcon.vue';
import DownloadIcon from '@/icons/DownloadIcon.vue';
import BombIcon from '@/icons/BombIcon.vue';

const store = useAppStore();
const { items, kills } = store;

const importModal = ref();
const exportModal = ref();
const el = ref();
const myWorldHouses = ref([]);
const editMode = ref(false);
const exportCode = ref('');
const codeEl = ref();
const currentHouse = ref({});
const houseModal = ref();

const updateCode = () => {
	myWorldHouses.value = JSON.parse(
		LZString.decompressFromEncodedURIComponent(codeEl.value.trim()),
	).map((house) => {
		return { ...house, step: 0, picked: false };
	});
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
		myWorldHouses.value = JSON.parse(JSON.stringify(houses));
		localStorage.removeItem('landsraad');
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

const houses = [
	{ id: '1', name: 'Alexin', wish: '', status: null, step: 0, picked: false },
	{ id: '2', name: 'Argosaz', wish: '', status: null, step: 0, picked: false },
	{ id: '3', name: 'Dyvetz', wish: '', status: null, step: 0, picked: false },
	{ id: '4', name: 'Ecaz', wish: '', status: null, step: 0, picked: false },
	{ id: '5', name: 'Hagal', wish: '', status: null, step: 0, picked: false },
	{ id: '6', name: 'Hurata', wish: '', status: null, step: 0, picked: false },
	{ id: '7', name: 'Imota', wish: '', status: null, step: 0, picked: false },
	{ id: '8', name: 'Kenola', wish: '', status: null, step: 0, picked: false },
	{ id: '9', name: 'Lindaren', wish: '', status: null, step: 0, picked: false },
	{ id: '10', name: 'Maros', wish: '', status: null, step: 0, picked: false },
	{ id: '11', name: 'Mikarrol', wish: '', status: null, step: 0, picked: false },
	{ id: '12', name: 'Moritani', wish: '', status: null, step: 0, picked: false },
	{ id: '13', name: 'Mutelli', wish: '', status: null, step: 0, picked: false },
	{ id: '14', name: 'Novebruns', wish: '', status: null, step: 0, picked: false },
	{ id: '15', name: 'Richèse', wish: '', status: null, step: 0, picked: false },
	{ id: '16', name: 'Sor', wish: '', status: null, step: 0, picked: false },
	{ id: '17', name: 'Spinette', wish: '', status: null, step: 0, picked: false },
	{ id: '18', name: 'Taligari', wish: '', status: null, step: 0, picked: false },
	{ id: '19', name: 'Thorvald', wish: '', status: null, step: 0, picked: false },
	{ id: '20', name: 'Tseida', wish: '', status: null, step: 0, picked: false },
	{ id: '21', name: 'Varota', wish: '', status: null, step: 0, picked: false },
	{ id: '22', name: 'Vernius', wish: '', status: null, step: 0, picked: false },
	{ id: '23', name: 'Wallach', wish: '', status: null, step: 0, picked: false },
	{ id: '24', name: 'Wayku', wish: '', status: null, step: 0, picked: false },
	{ id: '25', name: 'Wydras', wish: '', status: null, step: 0, picked: false },
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

onMounted(() => {
	myWorldHouses.value = JSON.parse(JSON.stringify(houses));
	const localLandsraad = JSON.parse(localStorage.getItem('landsraad'));
	if (localLandsraad) {
		myWorldHouses.value = localLandsraad;
	}
});

const saveMyWorldHouses = () => {
	if (myWorldHouses.value.length > 0) {
		const localHouses = JSON.parse(JSON.stringify(myWorldHouses.value)).map((house) => {
			delete house._wish;
			return house;
		});
		localStorage.setItem('landsraad', JSON.stringify(localHouses));
	}

	const cleanCode = JSON.parse(JSON.stringify(myWorldHouses.value)).map((house) => {
		delete house.step;
		delete house.picked;
		delete house._wish;
		return house;
	});
	exportCode.value = LZString.compressToEncodedURIComponent(JSON.stringify(cleanCode));
};

saveMyWorldHouses();

watch(myWorldHouses, async () => {
	saveMyWorldHouses();
});

const handleShowHouseDetails = (houseId) => {
	if (editMode.value) {
		return;
	}
	const house = myWorldHouses.value.find((house) => house.id === houseId);
	currentHouse.value = house;
	if (house?.wish > 0) {
		currentHouse.value._wish = {
			type: 'item',
			...items.find((item) => item.pk === house.wish),
		};
	} else if (house?.wish < 0) {
		currentHouse.value._wish = {
			type: 'kill',
			...kills.find((kill) => kill.id === house.wish),
		};
	}
	houseModal.value.showModal();
};

const handleUpdateStep = (houseId) => {
	myWorldHouses.value.find((house) => house.id === houseId).picked = false;
	saveMyWorldHouses();
};
</script>
