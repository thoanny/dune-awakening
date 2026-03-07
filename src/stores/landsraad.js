import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import LZString from 'lz-string';
import dataHouses from '@/data/houses.json';

export const useLandsraadStore = defineStore('landsraad', () => {
	const houses = ref();
	const currentHouse = ref({});
	const version = 2;

	const steps_points = [700, 3500, 7000, 10500, 14000];

	const _saveLocalLandsraad = () => {
		console.log('_saveLocalLandsraad');
		localStorage.setItem(
			'landsraad',
			JSON.stringify({
				data: houses.value.map((house) => ({
					_: house.id,
					s: house.status,
					u: house.user.step,
					p: +house.user.picked,
					o: house.sort,
				})),
				version: version,
			}),
		);
	};

	const initialData = () => {
		console.log('initialData');
		houses.value = dataHouses.map((house, h) => ({
			...house,
			status: '',
			user: { step: 0, picked: false },
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
						status: landsraad.s,
						user: {
							step: landsraad.u,
							picked: Boolean(landsraad.p),
						},
						sort: landsraad.o,
					};
				}
			});
			houses.value.sort((a, b) => a.sort - b.sort);
		}
	};

	initialData();

	const exportHousesCode = computed(() => {
		return LZString.compressToEncodedURIComponent(
			JSON.stringify(
				houses.value
					.map((house) => ({
						_: house.id,
						s: house.status,
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
					houses.value[idx] = {
						...houses.value[idx],
						status: importedHouse.s,
						sort: importedHouse.o,
					};
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
		if (confirm('Vous voulez réinitialiser les données ?') == true) {
			localStorage.removeItem('landsraad');
			initialData();
		}
	};

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

	return {
		houses,
		currentHouse,
		exportHousesCode,
		steps_points,
		handleUpdateStatus,
		handleUpdateSort,
		handleReset,
		handleImportHouses,
		handleUpdateStep,
		handleUpdatePicked,
	};
});
