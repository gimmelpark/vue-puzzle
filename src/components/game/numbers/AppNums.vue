<template>
	<div class="nums" :class="numsLayoutClass" :style="numsStyle">
		<div 
			v-for="(line, i) in nums" 
			:key="'line-' + i" 
			class="line"
			:class="lineClass(i)"
			:style="lineStyle"
		>
			<app-nums-line
				:direction="numsDirection"
				:line="line"
				:pointSize="pointSize"
				:showErrors="showErrors"
				:allDone="allFieldDone"
			></app-nums-line>
		</div>
	</div>
</template>

<script>
import AppNumsLine from '@/components/game/numbers/AppNumsLine.vue'

import { mapGetters } from 'vuex'

export default {
	props: {
		layout: {
			type: String,
			required: true
		},
		
	},
	components: {
		AppNumsLine,
	},
	computed: {
		...mapGetters('field', {
			field: 'getField',
			pointSize: 'getPointSize',
			fieldHeight: 'getFieldHeight',
			fieldWidth: 'getFieldWidth',
		}),
		...mapGetters('nums', {
			rowsWidth: 'getRowsWidth',
			colsHeight: 'getColsHeight',
			allDone: 'isAllDone',
			allCorrect: 'isAllCorrect',
		}),

		allFieldDone () {
			return this.allDone && this.allCorrect
		},

		// отображать ли ошибки
		showErrors (){
			return this.$store.getters['field/getSettingByID'](0).value
		},

		// массив цифр
		nums () {
			return this.$store.getters['nums/getLine'](this.numsDirection)
		},

		// максимальная колличество цифр в линии
		maxLength () {
			return this.$store.getters['nums/getMaxLength'](this.numsDirection)
		},

		// направление
		numsDirection () {
			return this.layout == 'left' ? true : false
		},

		numsStyle (){
			return this.numsDirection ? 
				'height:' + this.fieldHeight + 'px;' : 
				'width:' + (this.fieldWidth) + 'px;';
		},

		numsLayoutClass () {
			return {
				'left': this.layout == 'left',
				'top': this.layout == 'top'
			}
		},

		lineStyle () {
			return this.numsDirection ?
				'height:' + (this.pointSize - 1) + 'px; width:' + this.rowsWidth + 'px;':
				'width:' + (this.pointSize - 1) + 'px; height:' + this.colsHeight + 'px;';
		},
		
	},

	methods: {
		lineClass (i){
			return {
				'line-row': this.numsDirection,
				'line-col': !this.numsDirection,
				'toll-line': i % 5 == 4 && i != this.nums.length - 1,
				'line-none': i == this.nums.length - 1,
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_vars.scss';

.nums {
	position: relative;
	
	.line {
		position: relative;
	}
	.line-row {
		border-bottom: 1px solid $num-line-color;
		
		width: 100%;
	}

	.line-row.toll-line {
		border-bottom: 2px solid $num-toll-line-color;
	}

	.line-row.line-none {
		border-bottom: none;
	}

	.line-col {
		float: left;
		border-right: 1px solid $num-line-color;
		height: 100%;
	}

	.line-col.toll-line {
		border-right: 2px solid $num-toll-line-color;
	}

	.line-col.line-none {
		border-right: none;
	}
}
.nums.left {
	float: right;
	min-width: 20px;
	border-top: 3px solid $num-toll-line-color;
}
.nums.top {
	position: absolute;
	right: 0;
	bottom: 0;
	min-height: 20px;
	border-left: 3px solid $num-toll-line-color;
}
</style>
