<template>
	<div id="puzzle-game">
		<div class="row" :style="'height: ' + (numsColsHeight) + 'px;'">
			<div :style="progressStyle" class="progress-layout">
				<v-progress-circular 
					:value="progress * 100"
					:size="progressCircleSize"
					:width="progressCircleWidth"
					:style="progressCircleStyle"
					:class="progressCircleClass"
				>	
					<transition name="progress-rotate" mode="out-in">
						<span v-if="!showProgressIcon">
							{{parseInt(progress * 100)}}%
						</span>
						<v-icon v-else :name="progressIconName" :key="progressIconName" class="progress-icon"></v-icon>
					</transition>
					
				</v-progress-circular>
			</div>
			<app-nums
				:layout="'top'"
			></app-nums>
		</div>
		<div 
			class="row"
			:style="'height: ' + (fieldHeight) + 'px;'"
		>
			<app-field></app-field>
			<app-nums
				:layout="'left'"
			></app-nums>
		</div>
	</div>
</template>

<script>
import AppField from '@/components/game/AppField.vue'
import AppNums from '@/components/game/numbers/AppNums.vue'

import "vue-awesome/icons/exclamation-circle";
import "vue-awesome/icons/check-circle";
import "vue-awesome/icons/regular/smile";

import Icon from "vue-awesome/components/Icon";

import { mapActions, mapGetters } from 'vuex'

export default {
	components: {
		AppField,
		AppNums,
		"v-icon": Icon,
	},
	created (){
		// инициализация хранилища
		this.dataInit()
		this.fieldInit()
		this.numsInit()
	},
	computed: {
		...mapGetters('field', {
			fieldHeight: 'getFieldHeight',
			fieldWidth: 'getFieldWidth',
			progress: 'getProgress',
		}),
		...mapGetters('nums', {
			numsColsHeight: 'getColsHeight',
			numsRowsWidth: 'getRowsWidth',
			allDone: 'isAllDone',
			allCorrect: 'isAllCorrect',
		}),

		// отображать ли ошибки
		showErrors (){
			return this.$store.getters['field/getSettingByID'](0).value
		},
		// надо ли прям ща отобразить ошибку
		fieldError (){
			return this.showErrors && !this.allCorrect
		},

		// всякие стили
		progressCircleSize (){
			return Math.min(this.numsRowsWidth, this.numsColsHeight) * 0.7
		},
		progressCircleWidth (){
			return Math.min(this.numsRowsWidth, this.numsColsHeight) * 0.1
		},
		progressCircleStyle (){
			return 'font-size: ' + (Math.min(this.numsRowsWidth, this.numsColsHeight) * 0.22) + 'px;'
		},
		progressCircleClass (){
			return {
				'circle-error': this.fieldError,
				'circle-done': this.allDone,
			}
		},
		progressStyle (){
			return 'width: ' + (this.numsRowsWidth) + 'px;'
		},

		// тип иконки в прогрессбаре
		progressIconName (){
			if (this.fieldError) return 'exclamation-circle'
			if (this.allDone) return 'check-circle'
			if (this.progress == 0) return 'regular/smile'
		},

		// нужна ли иконка в прогрессбаре
		showProgressIcon () {
			return this.fieldError || this.allDone || this.progress == 0
		},
	},
	methods: {
		...mapActions('field', {fieldInit: 'fieldInit'}),
		...mapActions('nums', {numsInit: 'numsInit'}),
		...mapActions('data', {dataInit: 'dataInit'})
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_vars.scss';

#puzzle-game{
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
	border: 3px solid $toll-line-color;
	overflow: hidden;
	position: relative;
}

.row {
	position: relative;
}

.progress-layout {
	box-sizing: border-box;
	float: left;
	height: 100%;
	position: relative;
	border: none;

	.v-progress-circular {
  		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		font-family: 'arial', sans-serif;
	}

	.v-progress-circular .progress-icon {
		height: 30%;
		width: 30%;
	}

	.v-progress-circular.circle-error{
		color: $progress-error;
	}
	.v-progress-circular.circle-done{
		color: $progress-done;
	}

	.progress-rotate-enter-active {
		animation: .2s progressRotateIn
	}
	.progress-rotate-leave-active {
		animation: .2s progressRotateOut
	}

	@keyframes progressRotateIn {
		from {
			transform: scaleX(0)
		}
		to {
			transform: scaleX(1)
		}
	}
	@keyframes progressRotateOut {
		from {
			transform: scaleX(1)
		}
		to {
			transform: scaleX(0)
		}
	}
}
</style>