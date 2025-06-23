<template>
	<div class="container mx-auto">
		<div class="header-image bg-primary">
			<div
				class="absolute w-full top-4 sm:top-8 xl:top-24 flex flex-col items-center mix-blend-screen text-primary"
			>
				<div class="text-xl sm:text-3xl font-bold">Dune: Awakening</div>
				<div class="text-lg sm:text-xl font-semibold">&mdash; Fansite &mdash;</div>
			</div>
			<!-- <img
				src="https://duneawakening.com/wp-content/uploads/09-DA_SC8B_Desktop_3840x2160.jpg"
				class="object-cover object-bottom w-full h-full"
				alt=""
				loading="lazy"
			/> -->
			<!-- <img
				src="https://duneawakening.com/wp-content/uploads/da-screenshot-1-e9e246.jpg"
				class="object-cover object-bottom w-full h-full"
				alt=""
				loading="lazy"
			/> -->
			<!-- <img
				src="https://duneawakening.com/wp-content/uploads/da-screenshot-10-a16165.jpg"
				class="object-cover object-bottom w-full h-full"
				alt=""
				loading="lazy"
			/> -->
			<!-- <img
				src="https://duneawakening.com/wp-content/uploads/da-screenshot-3-1e5a01.jpg"
				class="object-cover object-bottom w-full h-full"
				alt=""
				loading="lazy"
			/> -->
			<!-- <img
				src="https://duneawakening.com/wp-content/uploads/2025/02/da-ss-f1-desertvista-180e30.png"
				class="object-cover object-bottom w-full h-full"
				alt=""
				loading="lazy"
			/> -->
			<img
				src="/img/bg-01.webp"
				class="object-cover object-bottom w-full h-full mix-blend-overlay"
				alt=""
				loading="lazy"
			/>
		</div>
		<div class="grid grid-cols-2 gap-4 mt-4 px-4">
			<div class="stats bg-base-300 text-center">
				<div class="stat">
					<div class="stat-value">{{ getTotalItems() }}</div>
					<div class="stat-desc">objets</div>
				</div>
			</div>
			<div class="stats bg-base-300 text-center">
				<div class="stat">
					<div class="stat-value">{{ getTotalRecipes() }}</div>
					<div class="stat-desc">recettes</div>
				</div>
			</div>
			<div class="stats bg-base-300 text-center">
				<div class="stat">
					<div class="stat-value">
						<span class="countdown font-mono">
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
					<div class="stat-desc">prochain redémarrage quotidien</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import moment from 'moment';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const { getTotalItems, getTotalRecipes } = store;

const UTC_DAILY_RESTART_HOUR = 3; // 3

const dailyRestartInterval = ref();
const dailyRestart = ref({});

const msToTime = (duration) => {
	var seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	};
};

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

<style scoped>
.header-image {
	aspect-ratio: 2/1;
	width: 100%;
	margin-top: -1rem;
	clip-path: polygon(0 0, 100% 0, 50% 100%);
	position: relative;
}
</style>
