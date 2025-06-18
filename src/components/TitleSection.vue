<template>
	<div class="flex items-center">
		<h1 class="title" style="">
			<span class="line-clamp-1">{{ title }}</span>
		</h1>
		<hr class="border-primary flex-1" />
	</div>
</template>

<script setup>
defineProps(['title']);
</script>
