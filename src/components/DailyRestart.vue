<template>
	<div class="stats bg-base-300 text-center col-span-2">
		<div class="stat">
			<div class="stat-value">
				<span class="countdown font-mono text-xl sm:text-3xl">
					<span
						:style="`--value: ${dailyRestart.hours}`"
						aria-live="polite"
						:aria-label="dailyRestart.hours"
						>{{ dailyRestart.hours }}</span
					>
					:
					<span
						:style="`--value: ${dailyRestart.minutes}`"
						aria-live="polite"
						:aria-label="dailyRestart.minutes"
						>{{ dailyRestart.minutes }}</span
					>
					:
					<span
						:style="`--value: ${dailyRestart.seconds}`"
						aria-live="polite"
						:aria-label="dailyRestart.seconds"
						>{{ dailyRestart.seconds }}</span
					>
				</span>
			</div>
			<div class="stat-desc">Prochain redémarrage serveur</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';
import msToTime from '@/utils/ms-to-time';

const UTC_DAILY_RESTART_HOUR = 3; // 3

const dailyRestartInterval = ref();
const dailyRestart = ref({});

const setDailyRestartValue = () => {
	const nextDailyRestart =
		moment().utc().hours() < UTC_DAILY_RESTART_HOUR
			? moment().utc().hours(UTC_DAILY_RESTART_HOUR).minutes(0).seconds(0)
			: moment().utc().hours(UTC_DAILY_RESTART_HOUR).minutes(0).seconds(0).add(1, 'd');
	dailyRestart.value = { ...msToTime(nextDailyRestart.diff(moment())) };
};

onMounted(() => {
	setDailyRestartValue();
	dailyRestartInterval.value = setInterval(setDailyRestartValue, 1000);
});

onUnmounted(() => {
	clearInterval(dailyRestartInterval.value);
});
</script>
