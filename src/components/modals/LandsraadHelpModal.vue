<template>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-xl font-bold text-primary">Comment ça fonctionne&nbsp;?</h3>
		<p class="py-4">
			Cliquez sur le bouton <strong class="text-primary text-shadow">Modifier</strong> pour
			personnaliser votre landsraad. Vous pouvez modifier l'ordre des maisons, leur état
			(gagné, perdu ou indéfini) ainsi que le souhait de la maison.
		</p>
		<ul class="list-disc ml-6">
			<li>
				<strong>Modifier l'ordre&nbsp;:</strong> cliquez-glissez les flèches vers la
				position souhaitée dans le tableau&nbsp;;
			</li>
			<li>
				<strong>modifier l'état&nbsp;:</strong> en haut à droite de chaque maison, cliquez
				gauche pour indiquer une victoire, cliquez droit (ou appui long sur écran tactile)
				pour indiquer une défaite&nbsp;; un second clic réinitialise l'état&nbsp;;
			</li>
			<li>
				<strong>Modifier le souhait&nbsp;:</strong> sélectionnez l'objet ou le type
				d'ennemis souhaité.
			</li>
		</ul>
		<p>
			Au cas où l'objet souhaité ou le type d'ennemis n'apparait pas dans la liste, vous
			pouvez me contacter pour que je réalise une mise à jour, en indiquant le nom ainsi que
			le nombre de points gagnés par unité.
		</p>
		<p class="py-4">
			Cliquez sur le bouton
			<strong class="text-primary text-shadow">Réinitialiser</strong> pour mettre à zéro
			l'ordre, l'état et le souhait des maisons, ainsi que votre progression personnelle.
		</p>
		<p>
			Cliquez sur la case d'une maison, lorsque la modification n'est pas active, pour
			afficher les détails de la maison ainsi que des paliers des récompenses (si le souhait
			est renseigné), ainsi que la localisation de son représentant.
		</p>
		<!-- <div class="inline-flex gap-2 items-center" v-if="editMode">
					<InfoCircleIcon class="size-5 shrink-0" />
					<span class="text-sm"
						>Clic gauche dans la case&nbsp;= gagné&nbsp;; clic droit (ou appui long sur
						mobile)&nbsp;= perdu.</span
					>
				</div> -->
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</template>
