<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<header class="text-shadow text-primary font-semibold mb-4">
		<nav>
			<RouterLink to="/"><span>Accueil</span></RouterLink>
			<RouterLink to="/items"><span>Objets</span></RouterLink>
			<RouterLink to="/recipes"><span>Schémas</span></RouterLink>
			<RouterLink to="/about"><span>À propos</span></RouterLink>
		</nav>
	</header>
	<div>
		<RouterView />
	</div>
</template>
