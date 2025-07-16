<template>
	<div class="modal-box max-w-sm" v-if="currentHouse">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<div class="flex flex-col items-center">
			<img
				:src="`/img/houses/${currentHouse.name}.webp`"
				alt=""
				class="size-32 object-contain z-20"
			/>
			<h4 class="text-xl font-bold">{{ currentHouse.name }}</h4>
			<div class="text-center" v-if="currentHouse.wish?.data">
				<RouterLink
					:to="{ name: 'item', params: { slug: currentHouse.wish.data.fields.slug } }"
					class="group"
					v-if="currentHouse.wish.type === 'item'"
				>
					Livrer&nbsp;:
					<span class="group-hover:underline">
						{{ currentHouse.wish.data.fields.name }}
					</span>
					<template v-if="currentHouse.wish?.data.fields.landsraad_points">
						<br /><small>
							<em>
								<span v-if="bonusActive">
									{{
										Math.ceil(
											currentHouse.wish.data.fields.landsraad_points * BONUS,
										)
									}}
								</span>
								<span v-else>
									{{
										Math.ceil(currentHouse.wish.data.fields.landsraad_points)
									}} </span
								>&nbsp;points/unité</em
							></small
						>
					</template>
				</RouterLink>
				<span v-else-if="currentHouse.wish.type === 'kill'">
					Tuer&nbsp;: {{ currentHouse.wish.data.name }}
					<br />
					<small>
						<em>
							<span v-if="bonusActive">
								{{ Math.ceil(kills_points * BONUS) }}
							</span>
							<span v-else> {{ Math.ceil(kills_points) }} </span
							>&nbsp;points/unité</em
						></small
					>
				</span>
			</div>
			<div class="flex flex-col gap-3 mt-4 w-full" v-if="currentHouse.wish">
				<label class="flex gap-2 items-center justify-center select-none">
					<input
						type="checkbox"
						class="toggle toggle-primary toggle-sm"
						v-model="currentHouse.user.picked"
						:disabled="currentHouse.user.step === 0"
						@change="handleUpdatePicked"
					/>
					Récompenses récupérées
				</label>
				<label class="flex gap-2 items-center justify-center select-none">
					<input
						type="checkbox"
						v-model="bonusActive"
						class="toggle toggle-primary toggle-sm"
						@change="handleLocalBonusActive"
					/>
					Bonus de 20%
				</label>
				<div
					v-if="
						currentHouse.wish.type === 'item' &&
						currentHouse.wish.data.fields.landsraad_points
					"
				>
					<table class="table table-sm">
						<thead>
							<tr>
								<th colspan="3">Palier</th>
								<th class="text-end">Qt</th>
								<th class="text-end">Total</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(step, s) in steps_points"
								:key="s"
								class="hover:bg-base-300 cursor-pointer"
								@click="handleUpdateStep(currentHouse.id, s + 1)"
							>
								<td width="1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="icon icon-tabler icons-tabler-filled icon-tabler-square-check size-5"
										:class="{
											'text-base-content opacity-50':
												currentHouse.user.step < s + 1,
											'text-success': currentHouse.user.step >= s + 1,
										}"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path
											d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
										/>
									</svg>
								</td>
								<td width="1">{{ s + 1 }}</td>
								<td class="text-end" width="1">{{ step }}&nbsp;pts</td>
								<td
									class="text-end font-bold text-primary text-shadow"
									v-if="bonusActive"
								>
									~&nbsp;{{
										Math.ceil(
											step /
												Math.ceil(
													currentHouse.wish.data.fields.landsraad_points *
														BONUS,
												),
										)
									}}
								</td>
								<td class="text-end font-bold text-primary text-shadow" v-else>
									&times;&nbsp;{{
										Math.ceil(
											step / currentHouse.wish.data.fields.landsraad_points,
										)
									}}
								</td>
								<td class="text-end" v-if="bonusActive">
									~&nbsp;{{
										Math.ceil(
											currentHouse.wish.data.fields.landsraad_points * BONUS,
										) *
										Math.ceil(
											step /
												Math.ceil(
													currentHouse.wish.data.fields.landsraad_points *
														BONUS,
												),
										)
									}}&nbsp;pts
								</td>
								<td class="text-end" v-else>
									=&nbsp;{{
										currentHouse.wish.data.fields.landsraad_points *
										Math.ceil(
											step / currentHouse.wish.data.fields.landsraad_points,
										)
									}}&nbsp;pts
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div v-if="currentHouse.wish.type === 'kill'">
					<table class="table table-sm">
						<thead>
							<tr>
								<th colspan="3">Palier</th>
								<th class="text-end">Qt</th>
								<th class="text-end">Total</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(step, s) in steps_points"
								:key="s"
								class="hover:bg-base-300 cursor-pointer"
								@click="handleUpdateStep(currentHouse.id, s + 1)"
							>
								<td width="1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="icon icon-tabler icons-tabler-filled icon-tabler-square-check size-5"
										:class="{
											'text-base-content opacity-50':
												currentHouse.user.step < s + 1,
											'text-success': currentHouse.user.step >= s + 1,
										}"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path
											d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
										/>
									</svg>
								</td>
								<td width="1">{{ s + 1 }}</td>
								<td class="text-end" width="1">{{ step }}&nbsp;pts</td>
								<td
									class="text-end font-bold text-primary text-shadow"
									v-if="bonusActive"
								>
									~&nbsp;{{ Math.ceil(step / Math.ceil(kills_points * BONUS)) }}
								</td>
								<td class="text-end font-bold text-primary text-shadow" v-else>
									&times;&nbsp;{{ Math.ceil(step / kills_points) }}
								</td>
								<td class="text-end" v-if="bonusActive">
									~&nbsp;{{
										Math.ceil(kills_points * BONUS) *
										Math.ceil(step / Math.ceil(kills_points * BONUS))
									}}&nbsp;pts
								</td>
								<td class="text-end" v-else>
									=&nbsp;{{
										kills_points * Math.ceil(step / kills_points)
									}}&nbsp;pts
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<a
				v-if="currentHouse.location?.url"
				:href="currentHouse.location.url"
				class="btn btn-primary btn-block mt-4"
				target="_blank"
				rel="nofollow"
			>
				Localiser le représentant
			</a>
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
const { handleLocalBonusActive, handleUpdatePicked, handleUpdateStep, kills_points, steps_points } =
	landsraad;
const { currentHouse, bonusActive } = storeToRefs(landsraad);

const BONUS = 1.2;
</script>
