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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="icon icon-tabler icons-tabler-filled icon-tabler-info-circle size-5 shrink-0"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path
							d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z"
						/>
					</svg>
					<span class="text-sm"
						>Clic gauche dans la case&nbsp;= gagné&nbsp;; clic droit (ou appui long sur
						mobile)&nbsp;= perdu.</span
					>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button class="btn btn-primary btn-square" @click="exportModal.showModal()">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-share size-5"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
						<path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
						<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
						<path d="M8.7 10.7l6.6 -3.4" />
						<path d="M8.7 13.3l6.6 3.4" />
					</svg>
				</button>
				<button class="btn btn-primary btn-square" @click="importModal.showModal()">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-download size-5"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
						<path d="M7 11l5 5l5 -5" />
						<path d="M12 4l0 12" />
					</svg>
				</button>
				<button class="btn btn-primary btn-square" @click="handleResetMyWorldHouses">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-bomb size-5"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path
							d="M15.349 5.349l3.301 3.301a1.2 1.2 0 0 1 0 1.698l-.972 .972a7.5 7.5 0 1 1 -5 -5l.972 -.972a1.2 1.2 0 0 1 1.698 0z"
						/>
						<path
							d="M17 7l1.293 -1.293a2.414 2.414 0 0 0 .707 -1.707a1 1 0 0 1 1 -1h1"
						/>
						<path d="M7 13a3 3 0 0 1 3 -3" />
					</svg>
				</button>
			</div>
		</div>
		<div class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4 select-none" ref="el">
			<div
				v-for="house in myWorldHouses"
				:key="house.id"
				class="bg-black/50 text-center flex flex-col items-center justify-center p-4 gap-2 border-2 relative"
				:class="{
					'border-transparent': !house.wish,
					'border-primary': house.wish && !house.status,
					// TODO : refine colors
					'border-error-content text-error-content bg-error': house.status === 'lost',
					'border-success-content text-success-content bg-success':
						house.status === 'win',
				}"
			>
				<span class="handle absolute top-2 left-2 cursor-move" v-show="editMode">
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
						class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-move size-5"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M18 9l3 3l-3 3" />
						<path d="M15 12h6" />
						<path d="M6 9l-3 3l3 3" />
						<path d="M3 12h6" />
						<path d="M9 18l3 3l3 -3" />
						<path d="M12 15v6" />
						<path d="M15 6l-3 -3l-3 3" />
						<path d="M12 3v6" />
					</svg>
				</span>
				<input
					type="checkbox"
					class="checkbox absolute top-2 right-2"
					:value="house.id"
					:indeterminate="house.status === 'lost'"
					@change.prevent="handleHouseWin"
					@contextmenu.prevent="handleHouseLost"
					:checked="house.status === 'win'"
					v-show="editMode"
				/>
				<img
					:src="`/img/houses/${house.name}.webp`"
					alt=""
					class="size-12 object-contain opacity-50"
				/>
				<span class="font-bold">{{ house.name }}</span>
				<select
					v-model="house.wish"
					class="select select-xs w-full"
					:class="{
						'select-error': house.status === 'lost',
						'select-success': house.status === 'win',
					}"
					@change="saveMyWorldHouses"
					v-if="!house.status && editMode"
				>
					<option value="">---</option>
					<option v-for="item in filteredItems" :key="item.pk" :value="item.pk">
						{{ item.fields.name }}
					</option>
				</select>
				<tippy v-else>
					<div class="flex gap-2 items-center justify-center">
						<img
							v-if="getItem(house.wish)?.fields.icon"
							:src="`/img/items/${getItem(house.wish)?.fields.icon}`"
							class="size-8 bg-neutral border border-primary p-1"
						/>
						<span class="text-xs line-clamp-2 text-start">{{
							house.wish ? getItem(house.wish)?.fields.name : '---'
						}}</span>
					</div>
					<template #content>
						<ItemTooltip :item="getItem(house.wish)" v-if="house.wish" />
					</template>
				</tippy>
			</div>
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
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { ref, onMounted, watch, computed } from 'vue';
import { useDraggable } from 'vue-draggable-plus';
import ItemTooltip from '@/components/ItemTooltip.vue';
import TitleSection from '@/components/TitleSection.vue';
import { useAppStore } from '@/stores/app';
const store = useAppStore();
const { items } = store;

const importModal = ref();
const exportModal = ref();

const filteredItems = computed(() => {
	return items
		.filter((item) => item.fields?.landsraad === true)
		.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
});

const getItem = (itemId) => {
	return items.find((item) => item.pk === itemId);
};

const updateCode = () => {
	myWorldHouses.value = JSON.parse(
		AES.decrypt(codeEl.value.trim(), SECRET).toString(CryptoJS.enc.Utf8),
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

const el = ref();
const myWorldHouses = ref([]);
const editMode = ref(false);
const exportCode = ref('');
const codeEl = ref();

const handleHouseLost = (event) => {
	const houseId = event.target.value;
	const idx = myWorldHouses.value.findIndex((house) => house.id === houseId);
	if (idx < 0) {
		return;
	}

	myWorldHouses.value[idx].status = myWorldHouses.value[idx].status === 'lost' ? null : 'lost';
	saveMyWorldHouses();
};

const handleHouseWin = (event) => {
	const houseId = event.target.value;
	const idx = myWorldHouses.value.findIndex((house) => house.id === houseId);
	if (idx < 0) {
		return;
	}

	myWorldHouses.value[idx].status = event.target.checked ? 'win' : null;
	saveMyWorldHouses();
};

const handleResetMyWorldHouses = () => {
	if (confirm('Vous voulez réinitialiser les données ?') == true) {
		myWorldHouses.value = JSON.parse(JSON.stringify(houses));
		localStorage.removeItem('landsraad');
		saveMyWorldHouses();
	}
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
	{ id: '8', name: 'Kenola', wish: '', status: null }, // Déserteurs
	{ id: '9', name: 'Lindaren', wish: '', status: null },
	{ id: '10', name: 'Maros', wish: '', status: null },
	{ id: '11', name: 'Mikarrol', wish: '', status: null },
	{ id: '12', name: 'Moritani', wish: '', status: null }, // Esclavagistes
	{ id: '13', name: 'Mutelli', wish: '', status: null },
	{ id: '14', name: 'Novebruns', wish: '', status: null }, // Diptères des sables
	{ id: '15', name: 'Richèse', wish: '', status: null }, // Pilleurs d'épaves
	{ id: '16', name: 'Sor', wish: '', status: null },
	{ id: '17', name: 'Spinette', wish: '', status: null },
	{ id: '18', name: 'Taligari', wish: '', status: null }, // Déserteurs
	{ id: '19', name: 'Thorvald', wish: '', status: null },
	{ id: '20', name: 'Tseida', wish: '', status: null }, // Feraille de carbure
	{ id: '21', name: 'Varota', wish: '', status: null }, // Troupes de la maison Atréides
	{ id: '22', name: 'Vernius', wish: '', status: null }, // Carte des creux
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

//////////////////////////////////////////////////////////////////////

// const exportLink = ref(null);
const SECRET = 'roUDSw98ntlA*gG#xU3zSXh0Ly7923^i#z#DuK#g'; // No secret!

const saveMyWorldHouses = () => {
	const encrypted = AES.encrypt(JSON.stringify(myWorldHouses.value), SECRET);
	// const blob = new Blob([encrypted], { type: 'text/plain' });
	// exportLink.value = window.URL.createObjectURL(blob);
	exportCode.value = encrypted;

	if (myWorldHouses.value.length > 0) {
		localStorage.setItem('landsraad', JSON.stringify(myWorldHouses.value));
	}
};

saveMyWorldHouses();

watch(myWorldHouses, async () => {
	saveMyWorldHouses();
});

// const importedFileError = ref(null);

// const importFile = (event) => {
// 	importedFileError.value = null;
// 	const file = event.target.files[0];
// 	const reader = new FileReader();
// 	reader.onload = (res) => {
// 		try {
// 			const data = res.target.result;
// 			const decrypt = AES.decrypt(data, SECRET).toString(CryptoJS.enc.Utf8);
// 			const value = JSON.parse(decrypt);
// 			myWorldHouses.value = value;
// 		} catch (error) {
// 			importedFileError.value = "Impossible d'importer ce fichier...";
// 			console.error(error);
// 		}
// 	};
// 	reader.onerror = (err) => (importedFileError.value = 'Impossible de lire ce fichier...');
// 	reader.readAsText(file);
// 	event.target.value = null;
// };
</script>
