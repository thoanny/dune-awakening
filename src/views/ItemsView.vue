<template>
	<table class="table">
		<tbody>
			<tr v-for="item in items" :key="item.id">
				<td>{{ item.id }}</td>
				<td>{{ item.name }}</td>
				<td>{{ item.category_id }}</td>
				<td>{{ item.subcategory_id }}</td>
				<td>{{ item.type_id }}</td>
				<td>{{ item.details }}</td>
				<td>{{ item.description }}</td>
				<td>{{ item.icon }}</td>
				<td>{{ item.volume }}</td>
				<td>{{ item.stack }}</td>
				<td>{{ item.level }}</td>
				<td>{{ item.quality }}</td>
				<td>{{ item.source_id }}</td>
				<td>{{ item.stats }}</td>
			</tr>
		</tbody>
	</table>
	<hr />
	<button v-tippy="{ content: 'Hi!' }">Tippy!</button>
	<button v-tippy="'Hello!'">Tippy!</button>

	<tippy>
		<button>Tippy!</button>
		<template #content> <strong>Hi!</strong> </template>
	</tippy>
</template>

<script setup>
import items from '@/data/items.json';
</script>
