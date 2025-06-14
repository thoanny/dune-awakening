<template>
	<div class="container mx-auto py-6">
		<h1>Dev</h1>
		<h2>Categories</h2>
		<ul>
			<li v-for="category in categories" :key="category.id">
				<strong>{{ category.id }}</strong> - {{ category.name }}
			</li>
		</ul>
		<h2>Subcategories</h2>
		<ul>
			<li v-for="category in subcategories" :key="category.id">
				<strong>{{ category.id }}</strong> - {{ category.name }}
			</li>
		</ul>
		<h2>Types</h2>
		<ul>
			<li v-for="type in array_to_tree(types)" :key="type.id">
				<strong>{{ type.id }}</strong> - {{ type.name }}

				<ul v-if="type.children.length > 0" class="ml-6">
					<li v-for="t in type.children" :key="t.id">
						<strong>{{ t.id }}</strong> - {{ t.name }}
					</li>
				</ul>
			</li>
		</ul>
		<h2>Sources</h2>
		<ul>
			<li v-for="source in sources" :key="source.id">
				<strong>{{ source.id }}</strong> - {{ source.name }}
			</li>
		</ul>
	</div>
</template>

<script setup>
import categories from '@/data/items_categories.json';
import subcategories from '@/data/items_subcategories.json';
import types from '@/data/items_types.json';
import sources from '@/data/items_sources.json';

const array_to_tree = (array, parent = null) => {
	return array
		.filter((arr) => arr.parent_id === parent)
		.map((arr) => ({ ...arr, children: array_to_tree(array, arr.id) }))
		.sort((a, b) => a.name.localeCompare(b.name));
};
</script>
