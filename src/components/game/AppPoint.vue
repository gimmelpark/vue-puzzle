<template>
	<div 
		class="puzzle-point" 
		@pointerdown="down"
		@pointerup="up"
		@pointerleave="leave"
	>
		<template v-if="showControlView  && !allDone">
			<div v-if="controlView == 1" class="point-positive control"></div>
			<div v-else-if="controlView == 0" class="zero-control"></div>
			<v-icon v-else-if="controlView == 2" name="times" class="times control" />
			<v-icon v-else-if="controlView == 3" name="question" class="question control" />
		</template>
		<transition name="point-scale" v-else>
			<div v-if="pointValue == 1" class="point-positive"></div>
			<v-icon v-else-if="pointValue == 2 && !allDone" name="times" class="times" />
			<v-icon v-else-if="pointValue == 3 && !allDone" name="question" class="question" />
		</transition>
		
		
	</div>
</template>

<script>
import "vue-awesome/icons/times";
import "vue-awesome/icons/question";
import Icon from "vue-awesome/components/Icon";

export default {
	components: {
		"v-icon": Icon,
	},
	props: {
		pointValue: {
			type: Number,
			required: true,
		},
		controlView: {
			required: true,
		},
		allDone: {
			type: Boolean,
			required: true,
		},
	},
	data: () =>({
		timer: undefined,
		longClick: false,
		isPointerDown: false,
	}),
	computed: {
		showControlView () {
			return this.controlView !== undefined
		},
	},
	methods: {
		down(e) {

			this.isPointerDown = true

			// если вычеркивание при долгом нажатии включено
			if (this.$store.getters['field/getSettingByID'](3).value  && !this.allDone) {
				
				this.timer = setTimeout(() => {

					this.longClick = true
					this.$emit("pointLongClick", e)

				}, 500)
			}
			
		},
		up(e) {

			clearTimeout(this.timer)
			
			// обычный клик
			if (!this.longClick && this.isPointerDown  && !this.allDone) {
				this.$emit("pointClick", e);
			}

			this.longClick = false
			this.isPointerDown = false
		},
		leave(e) {
			clearTimeout(this.timer)
			this.longClick = false
			this.isPointerDown = false
		}
	},
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_vars.scss';

.puzzle-point {
	position: relative;
	float: left;
	width: calc(100% - 4px);
	height: calc(100% - 4px);
	margin: 2px;

	.zero-control {
		height: calc(100% - 2px);
		width: calc(100% - 2px);
		border: 1px solid $control-view-zero;
	}

	.point-positive {
		height: 100%;
		width: 100%;
		border-radius: 10%;
		background-color: $point-color;
	}

	.point-positive.control{
		
		background-color: $control-color;
	}

	.point-scale-enter-active{
		animation: .2s pointIn;
	}

	.point-scale-leave-active{
		animation: .2s pointOut;
	}

	@keyframes pointIn {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes pointOut {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0);
		}
	}

	.fa-icon {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: auto;
		color: $point-icon-color;
		max-width: 100%;
		max-height: 100%;
	}

	.fa-icon.control {
		color: $control-icon-color;
	}

	.fa-icon.times{
		height: 100%;
	}
	.fa-icon.question{
		height: 80%;
	}

}


</style>
