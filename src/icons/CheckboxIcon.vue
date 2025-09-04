<template>
	<svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<polygon
			points="11.78 22.08 1.9 12.19 11.78 2.31 16.6 7.12 21.67 12.19 11.78 22.08"
			fill="var(--color-base-100)"
			:stroke="checked ? 'var(--color-success)' : 'var(--color-primary)'"
			stroke-miterlimit="10"
			stroke-width="1.25"
		/>
		<path
			d="M12.09,11.87l4.5-4.75,2.42,2.42-6.91,6.87c-.18.17-.46.17-.64,0l-3.91-3.9c-.18-.18-.18-.46,0-.64l1.61-1.61c.18-.18.46-.18.64,0l1.66,1.62c.18.17.46.17.63-.01Z"
			fill="var(--color-success)"
			v-if="checked"
		/>
	</svg>
</template>

<script setup>
defineProps(['checked']);
</script>
