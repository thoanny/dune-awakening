import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import LZString from 'lz-string';
import dataHouses from '@/data/houses.json';
import { useRouter } from 'vue-router';

export const useLandsraadStore = defineStore('landsraad', () => {
	const houses = ref();
	const version = 3;

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
					pts: house.user.points,
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
			user: { step: 0, picked: false, points: 0 },
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
				localStorage.removeItem('landsraad-old');
				localStorage.removeItem('landsraad-bonus');
				localStorage.removeItem('landsraad-display');

				const router = useRouter();
				router.go();
			}
			localLandsraad.data?.forEach((landsraad) => {
				const idx = houses.value.findIndex((house) => house.id === landsraad._);
				if (idx >= 0) {
					houses.value[idx] = {
						...houses.value[idx],
						status: landsraad.s,
						user: {
							step: landsraad.u,
							points: landsraad.pts,
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

	const handleUpdateStep = (houseId) => {
		console.log('handleUpdateStep');
		const house = houses.value.find((h) => h.id === houseId);
		const idx = steps_points.reverse().findIndex((step) => {
			return house.user.points >= step;
		});
		steps_points.reverse();
		(house.user.step = idx < 0 ? 0 : steps_points.length - idx), (house.user.picked = false);
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

	const handleAddPoints = (houseId, points) => {
		console.log('handleAddPoints');
		const house = houses.value.find((h) => h.id === houseId);
		if (house.user.points + points > steps_points.slice(-1)) {
			house.user.points = steps_points.slice(-1)[0];
		} else {
			house.user.points += points;
		}
		handleUpdateStep(houseId);
	};

	return {
		houses,
		exportHousesCode,
		steps_points,
		handleUpdateStatus,
		handleUpdateSort,
		handleReset,
		handleImportHouses,
		handleUpdateStep,
		handleUpdatePicked,
		handleAddPoints,
	};
});
