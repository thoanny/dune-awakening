<template>
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>name</th>
				<th>category</th>
				<th>subcategory</th>
				<th>type</th>
				<th>details</th>
				<th>description</th>
				<th>icon</th>
				<th>volume</th>
				<th>stack</th>
				<th>level</th>
				<th>quality</th>
				<th>sources</th>
				<th>stats</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in items" :key="item.pk" class="hover:bg-base-300">
				<td>
					<a
						:href="`http://127.0.0.1:7000/admin/app/item/${item.pk}/change/`"
						target="_blank"
						class="btn btn-primary btn-outline"
					>
						{{ item.pk }}
					</a>
				</td>
				<td>{{ item.fields.name }}</td>
				<td>{{ item.fields.category?.name }}</td>
				<td>{{ item.fields.subcategory?.name }}</td>
				<td>{{ item.fields.type?.name }}</td>
				<td>{{ item.fields.details }}</td>
				<td>{{ item.fields.description }}</td>
				<td>{{ item.fields.icon }}</td>
				<td>
					{{ item.fields.volume ? (item.fields.volume / 100).toLocaleString('fr') : '' }}
				</td>
				<td>{{ item.fields.stack }}</td>
				<td>{{ item.fields.level }}</td>
				<td>{{ item.fields.quality }}</td>
				<td>{{ item.fields.sources }}</td>
				<td>{{ item.fields.stats }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup>
import items from '@/data/items.json';
</script>
