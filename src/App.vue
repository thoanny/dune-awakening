<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const interval = ref(null);
const nextTime = ref();
const nextDate = ref();

const updateTimer = () => {
	const amount = 45 * 60; // 45 minutes
	const start = new Date('2025-06-07 21:00:00');
	const now = new Date();
	const next = (amount - (((now - start) / 1000) % amount)) / 60;

	nextTime.value = Math.round(next);
	nextDate.value = new Date(now.getTime() + next * 1000 * 60);
};

onMounted(() => {
	updateTimer();
	interval.value = setInterval(updateTimer, 1000 * 10);
});

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});
</script>

<template>
	<div class="flex flex-col gap-4 items-center justify-center w-full h-screen">
		<div class="grid auto-cols-max grid-flow-col gap-5 text-center">
			<div class="bg-neutral rounded-box text-neutral-content flex flex-col p-2">
				<span class="countdown font-mono text-8xl">
					<span :style="`--value: ${nextTime}`" aria-live="polite" :aria-label="nextTime">
						{{ nextTime }}
					</span>
				</span>
				min
			</div>
		</div>
		<div>
			{{
				new Intl.DateTimeFormat('fr-FR', {
					dateStyle: 'full',
					timeStyle: 'long',
					timeZone: 'Europe/Paris',
				}).format(nextDate)
			}}
		</div>
	</div>
</template>
