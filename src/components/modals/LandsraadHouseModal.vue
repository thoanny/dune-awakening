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
								<span>
									{{
										Math.round(
											currentHouse.wish.data.fields.landsraad_points * coef,
										)
									}}
								</span>
								&nbsp;points/unité</em
							></small
						>
					</template>
				</RouterLink>
				<span v-else-if="currentHouse.wish.type === 'kill'">
					Tuer&nbsp;: {{ currentHouse.wish.data.name }}
					<br />
					<small>
						<em>
							<span>
								{{ Math.round(kills_points * coef) }}
							</span>
							&nbsp;points/unité</em
						></small
					>
				</span>
			</div>
			<div class="flex flex-col gap-3 mt-4 w-full" v-if="currentHouse.wish">
				<div class="flex items-center gap-3">
					<input
						type="range"
						min="0"
						:max="BONUSMAX"
						class="range range-sm range-primary w-full"
						v-model="bonusLevel"
						@change="handleLocalBonusLevel"
					/>
					<label class="text-left whitespace-nowrap w-28 shrink-0"
						>Bonus de {{ bonusLevel * 20 }} %</label
					>
				</div>
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
				<div
					v-if="
						currentHouse.wish.type === 'item' &&
						currentHouse.wish.data.fields.landsraad_points
					"
				>
					<table class="table table-sm">
						<thead>
							<tr>
								<th colspan="2">Palier</th>
								<th class="text-end">Points</th>
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
								@contextmenu.prevent="handleUpdateTarget(currentHouse.id, s + 1)"
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
												currentHouse.user.step < s + 1 &&
												(currentHouse.user.target < s + 1 ||
													!currentHouse.user.target),
											'text-success': currentHouse.user.step >= s + 1,
											'text-primary':
												currentHouse.user.target >= s + 1 &&
												currentHouse.user.step < s + 1,
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
								<td class="text-end font-bold text-primary text-shadow">
									&times;&nbsp;{{
										Math.ceil(
											step /
												(currentHouse.wish.data.fields.landsraad_points *
													coef),
										)
									}}
								</td>
								<td class="text-end">
									=&nbsp;{{
										Math.ceil(
											step /
												(currentHouse.wish.data.fields.landsraad_points *
													coef),
										) *
										Math.round(
											currentHouse.wish.data.fields.landsraad_points * coef,
										)
									}}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div v-if="currentHouse.wish.type === 'kill'">
					<table class="table table-sm">
						<thead>
							<tr>
								<th colspan="2">Palier</th>
								<th class="text-end">Points</th>
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
								<td class="text-end font-bold text-primary text-shadow">
									&times;&nbsp;{{
										Math.ceil(step / Math.round(kills_points * coef))
									}}
								</td>
								<td class="text-end">
									=&nbsp;{{
										Math.ceil(step / Math.round(kills_points * coef)) *
										Math.round(kills_points * coef)
									}}
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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLandsraadStore } from '@/stores/landsraad';

const landsraad = useLandsraadStore();
const {
	handleLocalBonusLevel,
	handleUpdatePicked,
	handleUpdateStep,
	handleUpdateTarget,
	kills_points,
	steps_points,
	BONUSMAX,
} = landsraad;
const { currentHouse, bonusLevel } = storeToRefs(landsraad);

const coef = computed(() => {
	return 1 + (bonusLevel.value * 20) / 100;
});
</script>
