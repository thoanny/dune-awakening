<template>
	<div class="modal-box max-h-[90dvh]">
		<h3 class="text-xl font-bold text-primary">Liste des objets possibles</h3>
		<table class="table table-sm mt-4">
			<thead>
				<tr>
					<th>Objet</th>
					<th>Points</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items" :key="item.pk">
					<td>
						<div class="inline-flex gap-2 items-center">
							<img
								:src="`/img/items/${item.fields.icon}`"
								class="size-6"
								alt=""
								v-if="item.fields.icon"
							/>
							{{ item.fields.name }}
						</div>
					</td>
					<td class="text-end">
						{{
							item.fields.landsraad_points
								? `${item.fields.landsraad_points} pts`
								: '???'
						}}
					</td>
				</tr>
			</tbody>
		</table>
		<div class="modal-action">
			<form method="dialog" class="w-full">
				<button class="btn btn-primary w-full">Fermer</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useLandsraadStore } from '@/stores/landsraad';

const landsraad = useLandsraadStore();

const { items } = storeToRefs(landsraad);
</script>
