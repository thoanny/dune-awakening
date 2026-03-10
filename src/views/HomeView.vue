<template>
	<div class="container mx-auto">
		<div class="header-image bg-primary">
			<div
				class="absolute w-full top-4 sm:top-8 xl:top-24 flex flex-col items-center mix-blend-screen text-primary"
			>
				<div class="text-xl sm:text-3xl font-bold">Dune: Awakening</div>
				<div class="text-lg sm:text-xl font-semibold">&mdash; Fansite &mdash;</div>
			</div>
			<img
				src="/img/bg-01.webp"
				class="object-cover object-bottom w-full h-full mix-blend-overlay"
				alt=""
				loading="lazy"
			/>
		</div>
		<div
			class="grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 mt-4 md:-mt-18 lg:-mt-24 xl:-mt-28 mb-8"
		>
			<DailyRestart />
			<WeeklyCoriolis />
		</div>
	</div>
</template>

<script setup>
import WeeklyCoriolis from '@/components/WeeklyCoriolis.vue';
import DailyRestart from '@/components/DailyRestart.vue';
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
