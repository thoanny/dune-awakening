import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import LZString from 'lz-string';
import dataHouses from '@/data/houses.json';
import dataItems from '@/data/items.json';

export const useLandsraadStore = defineStore('landsraad', () => {
	const BONUSMAX = 5;
	const houses = ref();
	const currentHouse = ref({});
	const editMode = ref(false);
	const version = 2;
	const bonusLevel = ref(0);

	const kills_points = 23;
	const steps_points = [700, 3500, 7000, 10500, 14000, 70000];

	const dataKills = [
		{
			id: -1,
			name: 'Troupes de la maison Harkonnen',
		},
		{
			id: -2,
			name: 'Troupes de la maison Atréides',
		},
		{
			id: -3,
			name: 'Déserteurs (Désert Profond)',
		},
		{
			id: -4,
			name: "Pilleurs d'épaves",
		},
		{
			id: -5,
			name: 'Esclavagistes',
		},
		{
			id: -6,
			name: 'Diptères des sables',
		},
		{
			id: -7,
			name: 'Maas Kharet',
		},
		{
			id: -8,
			name: 'Kirabs',
		},
		{
			id: -9,
			name: 'Déserteurs (Bassin de Hagga)',
		},
	];

	const _saveLocalLandsraad = () => {
		console.log('_saveLocalLandsraad');
		localStorage.setItem(
			'landsraad',
			JSON.stringify({
				data: houses.value.map((house) => ({
					_: house.id,
					w: house.wish_id,
					s: house.status,
					u: house.user.step,
					t: house.user.target,
					p: +house.user.picked,
					o: house.sort,
				})),
				version: version,
			}),
		);
	};

	const handleUpdateWish = (houseId, wishId, init = false) => {
		console.log('handleUpdateWish');
		const idx = houses.value.findIndex((house) => house.id === houseId);
		if (idx < 0) {
			return;
		}

		if (houses.value[idx].wish.id === wishId) {
			return;
		}

		// TODO : erreur
		// if (!init) {
		// 	houses.value[idx].user.step = 0;
		// 	houses.value[idx].user.picked = false;
		// }

		// Reset
		houses.value[idx].wish_id = wishId;
		houses.value[idx].wish = {
			type: null,
			data: null,
		};

		if (wishId > 0) {
			houses.value[idx].wish = {
				type: 'item',
				data: dataItems.find((item) => item.pk === wishId),
			};
		} else if (wishId < 0) {
			houses.value[idx].wish = {
				type: 'kill',
				data: dataKills.find((kill) => kill.id === wishId),
			};
		}

		if (!init) {
			_saveLocalLandsraad();
		}
	};

	const initialData = () => {
		console.log('initialData');
		houses.value = dataHouses.map((house, h) => ({
			...house,
			wish_id: 0,
			wish: { type: null, data: null },
			status: '',
			user: { step: 0, target: 0, picked: false },
			sort: h,
		}));

		const localLandsraad = JSON.parse(localStorage.getItem('landsraad'));
		if (localLandsraad) {
			if (
				typeof localLandsraad.version === 'undefined' ||
				localLandsraad.version !== version
			) {
				localStorage.removeItem('landsraad');
				localStorage.removeItem('landsraad-user');
			}
			localLandsraad.data?.forEach((landsraad) => {
				const idx = houses.value.findIndex((house) => house.id === landsraad._);
				if (idx >= 0) {
					houses.value[idx] = {
						...houses.value[idx],
						wish_id: landsraad.w,
						status: landsraad.s,
						user: {
							step: landsraad.u,
							target: landsraad.t,
							picked: Boolean(landsraad.p),
						},
						sort: landsraad.o,
					};

					if (landsraad.w !== 0) {
						handleUpdateWish(landsraad._, landsraad.w, true);
					}
				}
			});
			houses.value.sort((a, b) => a.sort - b.sort);
		}
	};

	initialData();

	const exportHousesCode = computed(() => {
		console.log('exportHousesCode');
		return LZString.compressToEncodedURIComponent(
			JSON.stringify(
				houses.value
					.map((house) => ({
						_: house.id,
						s: house.status,
						w: house.wish_id,
						o: house.sort,
					}))
					.sort((a, b) => a._ - b._),
			),
		);
	});

	const handleImportHouses = (code) => {
		console.log('handleImportHouses');
		try {
			const importedHouses = JSON.parse(
				LZString.decompressFromEncodedURIComponent(code.trim()),
			);
			importedHouses.forEach((importedHouse) => {
				const idx = houses.value.findIndex((house) => house.id === importedHouse._);
				if (idx >= 0) {
					if (houses.value[idx].wish_id !== importedHouse.w) {
						houses.value[idx].user = {
							step: 0,
							picked: false,
						};
					}
					houses.value[idx] = {
						...houses.value[idx],
						status: importedHouse.s,
						wish_id: importedHouse.w,
						sort: importedHouse.o,
					};

					if (importedHouse.w !== 0) {
						handleUpdateWish(importedHouse._, importedHouse.w);
					}
				}
			});
			houses.value.sort((a, b) => a.sort - b.sort);
			_saveLocalLandsraad();
		} catch {
			alert("Impossible d'importer les données...");
		}
	};

	/*
    status : win (w) || lost (l)
  */
	const handleUpdateStatus = (houseId, status) => {
		console.log('handleUpdateStatus');
		const idx = houses.value.findIndex((house) => house.id === houseId);
		if (idx < 0) {
			return;
		}

		houses.value[idx].status = houses.value[idx].status === status ? null : status;
		_saveLocalLandsraad();
	};

	const handleReset = () => {
		console.log('handleReset');
		if (confirm('Vous voulez réinitialiser les données ?') == true) {
			localStorage.removeItem('landsraad');
			initialData();
		}
	};

	const kills = computed(() => {
		return dataKills.sort((a, b) => a.name.localeCompare(b.name));
	});

	const items = computed(() => {
		return dataItems
			.filter((item) => item.fields?.landsraad === true)
			.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
	});

	const handleUpdateSort = () => {
		console.log('handleUpdateSort');
		houses.value = houses.value.map((house, h) => ({ ...house, sort: h }));
		_saveLocalLandsraad();
	};

	const handleUpdateStep = (houseId, step) => {
		console.log('handleUpdateStep');
		const house = houses.value.find((h) => h.id === houseId);
		(house.user.step = house.user.step === step ? 0 : step), (house.user.picked = false);
		_saveLocalLandsraad();
	};

	const handleUpdateTarget = (houseId, target) => {
		console.log('handleUpdateTarget');
		const house = houses.value.find((h) => h.id === houseId);
		house.user.target = house.user.target === target ? 0 : target;
		_saveLocalLandsraad();
	};

	const handleUpdatePicked = (houseId = null) => {
		if (houseId) {
			const idx = houses.value.findIndex((house) => house.id === houseId);
			if (idx >= 0) {
				houses.value[idx].user.picked = !houses.value[idx].user.picked;
			}
		}
		console.log('handleUpdatePicked', houseId);
		_saveLocalLandsraad();
	};

	const initLocalBonusLevel = () => {
		console.log('initLocalBonusLevel');
		const localBonusLevel = localStorage.getItem('landsraad-bonus');
		if (localBonusLevel !== null) {
			bonusLevel.value =
				localBonusLevel >= 0 && localBonusLevel <= BONUSMAX ? localBonusLevel : 0;
		}
	};

	initLocalBonusLevel();

	const handleLocalBonusLevel = () => {
		console.log('handleLocalBonusLevel');
		localStorage.setItem('landsraad-bonus', bonusLevel.value);
	};

	return {
		houses,
		currentHouse,
		bonusLevel,
		kills,
		items,
		editMode,
		exportHousesCode,
		kills_points,
		steps_points,
		BONUSMAX,
		handleUpdateStatus,
		handleUpdateWish,
		handleUpdateSort,
		handleReset,
		handleImportHouses,
		handleUpdateStep,
		handleUpdatePicked,
		handleUpdateTarget,
		handleLocalBonusLevel,
	};
});
