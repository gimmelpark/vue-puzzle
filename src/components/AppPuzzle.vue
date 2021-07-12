<template>
	<div id="puzzle-wrapper" ref="puzzle-wrapper">

		<div id="puzzle-layout" :style="wrpperStyle" ref="puzzle-layout">
			<app-game></app-game>
			<app-control></app-control>
		</div>

		<resize-observer @notify="handleResize" />
	</div>
</template>

<script>
import AppGame from '@/components/game/AppGame.vue'
import AppControl from '@/components/game/AppControl.vue'

import { ResizeObserver } from 'vue-resize'

import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		AppGame,
		AppControl,
		ResizeObserver,
	},
	mounted () {
		this.resize({
			wrppWidth: this.$refs['puzzle-wrapper'].clientWidth,
			wrppHeight: this.$refs['puzzle-wrapper'].clientHeight,
			width: this.fieldWidth + this.numsRowsWidth + 9,
			height: 1,
		})
	},
	computed: {
		...mapGetters('field', {
			fieldWidth: 'getFieldWidth',
			scale: 'getScale',
		}),
		...mapGetters('nums', {
			numsRowsWidth: 'getRowsWidth',
		}),

		wrpperStyle (){
			return 'width: ' + (this.fieldWidth + this.numsRowsWidth + 9) + 'px; transform: scale(' + this.scale + ');'
		},

	},
	methods: {
		...mapActions('field', {
			resize: 'wrapperResize',
		}),
		handleResize (){
			this.resize({
				wrppWidth: this.$refs['puzzle-wrapper'].clientWidth,
				wrppHeight: this.$refs['puzzle-wrapper'].clientHeight,
				width: this.$refs['puzzle-layout'].clientWidth,
				height: this.$refs['puzzle-layout'].clientHeight,
			})
		}
	}
}
</script>

<style lang="scss" scoped>

#puzzle-wrapper {
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	flex-wrap: nowrap;

	#puzzle-layout {
		flex-shrink: 0;
	}
}

</style>