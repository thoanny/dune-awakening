<template>
	<component :is="mk[level]" v-if="level >= 0" />
</template>

<script setup>
import Mk0Icon from '@/icons/Mk0Icon.vue';
import Mk1Icon from '@/icons/Mk1Icon.vue';
import Mk2Icon from '@/icons/Mk2Icon.vue';
import Mk3Icon from '@/icons/Mk3Icon.vue';
import Mk4Icon from '@/icons/Mk4Icon.vue';
import Mk5Icon from '@/icons/Mk5Icon.vue';
import Mk6Icon from '@/icons/Mk6Icon.vue';

defineProps(['level']);

const mk = [Mk0Icon, Mk1Icon, Mk2Icon, Mk3Icon, Mk4Icon, Mk5Icon, Mk6Icon];
</script>
