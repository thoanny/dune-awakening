<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<div class="mt-4 px-4 flex gap-2 items-center">
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
			Clic gauche dans la case&nbsp;: gagné&nbsp;; clic droit (ou appui long sur
			mobile)&nbsp;: perdu.
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
				<span class="handle absolute top-2 left-2 cursor-move">
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
					v-if="!house.status"
				>
					<option value="">---</option>
					<optgroup label="Objets">
						<option v-for="item in items" :key="item.pk">
							{{ item.fields.name }}
						</option>
					</optgroup>
				</select>
				<span class="line-clamp-1 text-xs my-1" v-else>{{
					house.wish ? house.wish : '---'
				}}</span>
			</div>
		</div>
		<div class="flex gap-2 items-center px-4 mt-4 justify-between">
			<a :href="exportLink" class="btn btn-primary" download="landsraad.txt">Exporter</a>
			<input type="file" class="file-input file-input-primary" @change="importFile" />
			<button class="btn btn-secondary" @click="handleResetMyWorldHouses">
				Réinitialiser
			</button>
		</div>
	</div>
</template>

<script setup>
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { ref, onMounted, watch } from 'vue';
import { useDraggable } from 'vue-draggable-plus';
import TitleSection from '@/components/TitleSection.vue';
import { useAppStore } from '@/stores/app';
const store = useAppStore();
const { items } = store;

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
	myWorldHouses.value = JSON.parse(JSON.stringify(houses));
	localStorage.removeItem('landsraad');
	saveMyWorldHouses();
};

useDraggable(el, myWorldHouses, {
	animation: 150,
	handle: '.handle',
	onStart() {},
	onUpdate() {
		saveMyWorldHouses;
	},
});

const houses = [
	{ id: '1', name: 'Alexin', wish: '', status: null }, // GRDA 44 d'adepte
	{ id: '2', name: 'Argosaz', wish: '', status: null }, // Bouclier Holtzman Mk 2
	{ id: '3', name: 'Dyvetz', wish: '', status: null }, // Manifeste du vaisseau
	{ id: '4', name: 'Ecaz', wish: '', status: null }, // Collecteur de rosée Mk 6
	{ id: '5', name: 'Hagal', wish: '', status: null }, // Épée de Regis
	{ id: '6', name: 'Hurata', wish: '', status: null }, // Poudre de plastanium insufflée d'épice
	{ id: '7', name: 'Imota', wish: '', status: null }, // Régulateur de puissance militaire
	{ id: '8', name: 'Kenola', wish: '', status: null }, // Déserteurs
	{ id: '9', name: 'Lindaren', wish: '', status: null }, // Trousse de secours Mk 6
	{ id: '10', name: 'Maros', wish: '', status: null }, // Lingot d'aluminium
	{ id: '11', name: 'Mikarrol', wish: '', status: null }, // Fibre de stravidium
	{ id: '12', name: 'Moritani', wish: '', status: null }, // Esclavagistes
	{ id: '13', name: 'Mutelli', wish: '', status: null }, // Pompe industrielle
	{ id: '14', name: 'Novebruns', wish: '', status: null }, // Diptères des sables
	{ id: '15', name: 'Richèse', wish: '', status: null }, // Pilleurs d'épaves
	{ id: '16', name: 'Sor', wish: '', status: null }, // Mélange
	{ id: '17', name: 'Spinette', wish: '', status: null }, // Bouclier Holtzman Mk 5
	{ id: '18', name: 'Taligari', wish: '', status: null }, // Déserteurs
	{ id: '19', name: 'Thorvald', wish: '', status: null }, // Kindjal de Regis
	{ id: '20', name: 'Tseida', wish: '', status: null }, // Feraille de carbure
	{ id: '21', name: 'Varota', wish: '', status: null }, // Troupes de la maison Atréides
	{ id: '22', name: 'Vernius', wish: '', status: null }, // Carte des creux
	{ id: '23', name: 'Wallach', wish: '', status: null }, // Poudre de fer insufflée d'épice
	{ id: '24', name: 'Wayku', wish: '', status: null }, // Opaflamme
	{ id: '25', name: 'Wydras', wish: '', status: null }, // Lingot de plastanium
];

onMounted(() => {
	myWorldHouses.value = JSON.parse(JSON.stringify(houses));
	const localLandsraad = JSON.parse(localStorage.getItem('landsraad'));
	if (localLandsraad) {
		myWorldHouses.value = localLandsraad;
	}
});

//////////////////////////////////////////////////////////////////////

const exportLink = ref(null);
const SECRET = 'roUDSw98ntlA*gG#xU3zSXh0Ly7923^i#z#DuK#g';

const saveMyWorldHouses = () => {
	const encrypted = AES.encrypt(JSON.stringify(myWorldHouses.value), SECRET);
	const blob = new Blob([encrypted], { type: 'text/plain' });
	exportLink.value = window.URL.createObjectURL(blob);

	if (myWorldHouses.value.length > 0) {
		localStorage.setItem('landsraad', JSON.stringify(myWorldHouses.value));
	}
};

saveMyWorldHouses();

watch(myWorldHouses, async () => {
	saveMyWorldHouses();
});

const importedFileError = ref(null);

const importFile = (event) => {
	importedFileError.value = null;
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onload = (res) => {
		try {
			const data = res.target.result;
			const decrypt = AES.decrypt(data, SECRET).toString(CryptoJS.enc.Utf8);
			const value = JSON.parse(decrypt);
			myWorldHouses.value = value;
		} catch (error) {
			importedFileError.value = "Impossible d'importer ce fichier...";
			console.error(error);
		}
	};
	reader.onerror = (err) => (importedFileError.value = 'Impossible de lire ce fichier...');
	reader.readAsText(file);
	event.target.value = null;
};
</script>
