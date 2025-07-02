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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDraggable } from 'vue-draggable-plus';
import LZString from 'lz-string';
import TitleSection from '@/components/TitleSection.vue';
import HouseTile from '@/components/HouseTile.vue';
import InfoCircleIcon from '@/icons/InfoCircleIcon.vue';
import ShareIcon from '@/icons/ShareIcon.vue';
import DownloadIcon from '@/icons/DownloadIcon.vue';
import BombIcon from '@/icons/BombIcon.vue';

const importModal = ref();
const exportModal = ref();
const el = ref();
const myWorldHouses = ref([]);
const editMode = ref(false);
const exportCode = ref('');
const codeEl = ref();

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

onMounted(() => {
	myWorldHouses.value = JSON.parse(JSON.stringify(houses));
	const localLandsraad = JSON.parse(localStorage.getItem('landsraad'));
	if (localLandsraad) {
		myWorldHouses.value = localLandsraad;
	}
});

const saveMyWorldHouses = () => {
	exportCode.value = LZString.compressToEncodedURIComponent(JSON.stringify(myWorldHouses.value));

	if (myWorldHouses.value.length > 0) {
		localStorage.setItem('landsraad', JSON.stringify(myWorldHouses.value));
	}
};

saveMyWorldHouses();

watch(myWorldHouses, async () => {
	saveMyWorldHouses();
});
</script>
