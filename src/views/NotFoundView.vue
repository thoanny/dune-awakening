<template>
	<main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
		<div class="text-center">
			<p class="text-base font-semibold text-accent">Erreur 404</p>
			<h1
				class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
			>
				Page introuvable
			</h1>
			<p class="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
				Désolé, cette page ne semble pas exister...
			</p>
			<div class="mt-10">
				<RouterLink :to="{ name: 'home' }" class="btn btn-primary"
					>Retourner à l'accueil</RouterLink
				>
			</div>
		</div>
	</main>
</template>
