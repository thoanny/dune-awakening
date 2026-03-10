<script setup lang="ts">
import ArrowsMoveIcon from '@/icons/ArrowsMoveIcon.vue';
</script>

<template>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-xl font-bold text-primary">Comment ça fonctionne&nbsp;?</h3>
		<p class="my-4">
			Cliquez sur la case d'une maison pour modifier votre progression et son statut
			(Atréides/Harkonnen). Cliquez sur un statut déjà défini pour le supprimer.
		</p>
		<p class="my-4">
			Modifier l'ordre des maisons dans le tableau en cliquant-glissant la flèche
			(<ArrowsMoveIcon class="inline-block size-5" />) vers la position souhaitée.
		</p>
		<p class="mt-4">
			Cliquez sur le bouton
			<strong class="text-primary text-shadow">Réinitialiser</strong> pour mettre à zéro
			l'ordre et le statut de toutes les maisons, ainsi que toute votre progression.
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</template>
