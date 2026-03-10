<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<header class="text-shadow text-primary font-semibold mb-4">
		<nav>
			<RouterLink :to="{ name: 'home' }"
				><span
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-home size-5 inline-block"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
						<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
						<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg></span
			></RouterLink>
			<RouterLink :to="{ name: 'landsraad' }"><span>Landsraad</span></RouterLink>
			<RouterLink :to="{ name: 'houses' }"><span>Maisons</span></RouterLink>
			<RouterLink :to="{ name: 'skins' }"><span>Skins</span></RouterLink>
		</nav>
	</header>
	<div>
		<RouterView />
	</div>
	<footer class="opacity-25 py-4 px-4 mt-2 text-center">
		Tous les logos, marques et images de ce site sont la propriété de Funcom. Ce site n'est pas
		affilié avec l'éditeur. Réalisé par
		<a href="https://thoanny.fr" target="_blank" class="link" rel="author noopener noreferrer"
			>Thoanny</a
		>
		•
		<a
			href="https://api.thoanny.fr/legal-notice"
			target="_blank"
			class="link"
			rel="noopener noreferrer"
			>Mentions légales</a
		>
	</footer>
</template>
