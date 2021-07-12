<template>
	<v-app>
		<div id="wrpp">
			<app-puzzle></app-puzzle>
		</div>	
	</v-app>
</template>

<script>
import AppPuzzle from './components/AppPuzzle.vue';


export default {
	name: 'App',

	components: {
		AppPuzzle,
	},

	data: () => ({
		//
	}),
};
</script>

<style lang="scss" scoped>
	#wrpp{
		width: 100%;
		height: 100vh;
	}
</style>


