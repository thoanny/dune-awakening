<template>
	<div class="container mx-auto text-center max-w-2xl">
		<h1 class="!text-3xl !my-6">🔥 Les T-potes 🔥</h1>
		<p class="mb-4">
			<strong>Merci infiniment à tou·te·s mes abonné·e·s sur Twitch et Patreon !</strong>
		</p>
		<p class="mb-4">
			Votre soutien fait toute la différence et me permet de continuer à créer du contenu et à
			travailler sur mes projets personnels. Que ce soit à travers vos abonnements ou vos
			encouragements, vous êtes une véritable source de motivation.
		</p>
		<p class="mb-4">Merci de croire en ce que je fais et de rendre cette aventure possible.</p>
		<p class="text-3xl mb-4">💚</p>
		<h2 class="mb-4 !text-2xl !text-primary">
			T-potes abonné·e·s via
			<a
				href="https://www.twitch.tv/thoanny"
				target="_blank"
				rel="nofollow"
				class="underline underline-offset-2"
				>Twitch</a
			>
		</h2>
		<div class="mb-6 mt-2" v-if="isLoading">
			<span class="loading loading-ring loading-md"></span>
		</div>
		<div class="flex flex-wrap gap-2 justify-center mb-6 mt-2" v-else>
			<span
				v-for="tpote in twitchTpotes"
				:key="tpote.id"
				class="badge badge-primary badge-lg"
				:class="{ 'badge-outline bg-base-200': !tpote.active }"
			>
				{{ tpote.name }}
			</span>
		</div>
		<h2 class="mb-4 !text-2xl !text-primary">
			T-potes abonné·e·s via
			<a
				href="https://www.patreon.com/thoanny"
				target="_blank"
				rel="nofollow"
				class="underline underline-offset-2"
				>Patreon</a
			>
		</h2>
		<div class="mb-6 mt-2" v-if="isLoading">
			<span class="loading loading-ring loading-md"></span>
		</div>
		<div class="flex flex-wrap gap-2 justify-center mt-2 mb-6" v-else>
			<span
				v-for="tpote in patreonTpotes"
				:key="tpote.id"
				class="badge badge-primary badge-lg"
				:class="{ 'badge-outline bg-base-200': !tpote.active }"
			>
				{{ tpote.name }}
			</span>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

const data = ref();
const isLoading = ref();

onMounted(async () => {
	isLoading.value = true;
	await fetch('https://api.thoanny.fr/tpotes')
		.then((res) => res.json())
		.then((d) => {
			data.value = d;
			console.log(data.value);
			isLoading.value = false;
		});
});

const twitchTpotes = computed(() => {
	return data.value?.tpotes.filter((tpote) => tpote.network === 'twitch');
});

const patreonTpotes = computed(() => {
	return data.value?.tpotes.filter((tpote) => tpote.network === 'patreon');
});

// useSeoMeta({
// 	title: 'Les T-potes',
// 	ogTitle: 'Les T-potes',
// 	description: 'Merci infiniment à tou·te·s mes abonné·e·s sur Twitch et Patreon !',
// 	ogDescription: 'Merci infiniment à tou·te·s mes abonné·e·s sur Twitch et Patreon !',
// });

// defineOgImageComponent('OHF', {
// 	title: 'Les T-potes',
// 	description: 'Merci infiniment à tou·te·s mes abonné·e·s sur Twitch et Patreon !',
// });
</script>
