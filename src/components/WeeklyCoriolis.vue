<template>
	<div class="stats bg-base-300 text-center col-span-2">
		<div class="stat">
			<div class="stat-value text-xl sm:text-3xl">{{ weeklyCoriolis?.start }}</div>
			<div class="stat-desc">Début de la tempête de Coriolis</div>
		</div>
	</div>
	<div class="stats bg-base-300 text-center col-span-2">
		<div class="stat">
			<div class="stat-value text-xl sm:text-3xl">{{ weeklyCoriolis?.end }}</div>
			<div class="stat-desc">Fin de la tempête de Coriolis</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';

const UTC_CORIOLIS_START_HOUR = 17; // 17 (19h Paris)
const UTC_CORIOLIS_END_HOUR = 3; // 3 (5h Paris)
const UTC_CORIOLIS_START_DAY = 1; // 1 (monday)
const UTC_CORIOLIS_END_DAY = 2; // 2 (tuesday)

const weeklyCoriolisInterval = ref();
const weeklyCoriolis = ref({});

const setWeeklyCoriolisValue = () => {
	const end = moment
		.utc()
		.day(UTC_CORIOLIS_END_DAY)
		.hour(UTC_CORIOLIS_END_HOUR)
		.minute(0)
		.second(0);
	const nextWeeklyCoriolisEnd =
		end > moment()
			? end
			: moment
					.utc()
					.day(UTC_CORIOLIS_END_DAY + 7)
					.hour(UTC_CORIOLIS_END_HOUR)
					.minute(0)
					.second(0);

	const nextWeeklyCoriolisStart =
		end > moment()
			? moment()
					.utc()
					.day(UTC_CORIOLIS_START_DAY)
					.hour(UTC_CORIOLIS_START_HOUR)
					.minute(0)
					.second(0)
			: moment()
					.utc()
					.day(UTC_CORIOLIS_START_DAY + 7)
					.hour(UTC_CORIOLIS_START_HOUR)
					.minute(0)
					.second(0);

	weeklyCoriolis.value = {
		start: new Intl.DateTimeFormat('fr-FR', {
			// weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		}).format(nextWeeklyCoriolisStart),
		end: new Intl.DateTimeFormat('fr-FR', {
			// weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		}).format(nextWeeklyCoriolisEnd),
	};
};

onMounted(() => {
	setWeeklyCoriolisValue();
	weeklyCoriolisInterval.value = setInterval(setWeeklyCoriolisValue, 1000 * 60);
});

onUnmounted(() => {
	clearInterval(weeklyCoriolisInterval.value);
});
</script>
