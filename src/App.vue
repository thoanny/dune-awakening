<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<header class="text-shadow text-primary font-semibold mb-4">
		<nav>
			<RouterLink :to="{ name: 'home' }"><span>Accueil</span></RouterLink>
			<RouterLink :to="{ name: 'landsraad' }"><span>Landsraad</span></RouterLink>
			<RouterLink :to="{ name: 'items' }"><span>Objets</span></RouterLink>
			<RouterLink :to="{ name: 'about' }" class="hidden sm:block">
				<span>À propos</span>
			</RouterLink>
		</nav>
	</header>
	<div>
		<RouterView />
	</div>
	<footer class="opacity-25 py-4 px-4 mt-2 text-center">
		Tous les logos, marques et images de ce site sont la propriété de Funcom. Ce site n'est pas
		affilié avec l'éditeur. Réalisé par
		<a href="https://thoanny.fr" target="_blank" class="link">Thoanny</a> •
		<a href="https://api.thoanny.fr/legal-notice" target="_blank" class="link"
			>Mentions légales</a
		>
	</footer>
</template>
