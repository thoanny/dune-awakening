<template>
	<div class="container mx-auto">
		<TitleSection title="Landsraad" />
		<div class="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-4">
			<div
				v-for="house in houses"
				:key="house"
				class="bg-black/50 text-center flex flex-col items-center justify-center p-4 font-bold gap-2"
			>
				<img
					:src="`/img/houses/${house}.webp`"
					alt=""
					class="size-16 object-contain opacity-50"
				/>
				{{ house }}
			</div>
		</div>
	</div>
</template>

<script setup>
import TitleSection from '@/components/TitleSection.vue';

/*

Cryshah :
- Début du landsraad : lundi 19h UTC
- Fin du landsraad : dimanche 19h UTC
- 5 tuiles : du mardi au samedi à 17h UTC
- Limite des récompenses : début du prochain landsraad

Discord officiel :
- New term starts: mardi 24 juin 2025 à 05:00 (Europe/Paris)
- Voting session starts: dimanche 29 juin 2025 à 20:00 (Europe/Paris)
- Voting session ends: lundi 23 juin 2025 à 20:00 (Europe/Paris)

*/

const houses = [
	'Hagal', // Épée de Regis
	'Mutelli', // Pompe industrielle
	'Kenola', // Déserteurs
	'Spinette', // Bouclier Holtzman Mk 5
	'Taligari', // Déserteurs
	'Tseida', // Feraille de carbure
	'Wayku', // Opaflamme
	'Argosaz', // Bouclier Holtzman Mk 2
	'Lindaren', // Trousse de secours Mk 6
	'Imota', // Régulateur de puissance militaire
	'Wallach', // Poudre de fer insufflée d'épice
	'Varota', // Troupes de la maison Atréides
	'Sor', // Mélange
	'Novebruns', // Diptères des sables
	'Hurata', // Poudre de plastanium insufflée d'épice
	'Maros', // Lingot d'aluminium
	'Thorvald', // Kindjal de Regis
	'Vernius', // Carte des creux
	'Dyvetz', // Manifeste du vaisseau
	'Alexin', // GRDA 44 d'adepte
	'Richèse', // Pilleurs d'épaves
	'Wydras', // Lingot de plastanium
	'Moritani', // Esclavagistes
	'Mikarrol', // Fibre de stravidium
	'Ecaz', // Collecteur de rosée Mk 6
];
</script>
