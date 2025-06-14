<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
	<div>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/items">Objets</RouterLink>
			<RouterLink to="/recipes">Schémas</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</div>
	<div>
		<RouterView />
	</div>
</template>
