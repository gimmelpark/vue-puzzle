<template>
	<div class="line-inf" :class="lineClass">
		<div :class="infIconContainerClass" :style="'width: ' + pointSize + 'px;height: ' + pointSize + 'px;'">
			<transition name="icon-scale" v-if="showIcon" :appear="true">
				<v-icon 
					:name="iconName" 
					class="inf-icon" 
					:class="infIconClass"
					:key="iconName"
				></v-icon>
			</transition>
		</div>
		
		<div class="nums-line">
			<div 
				v-for="(num, i) in line.nums"
				:key="'num-' + i"
				class="num"
				:style="numStyle"
				:class="{'unactive': num.done && !allDone}"
			>
				<span :style="'font-size:' + (pointSize * 0.6) + 'px;'">{{num.value}}</span>
			</div>
		</div>
	</div>
	
</template>

<script>
import "vue-awesome/icons/exclamation-circle";
import "vue-awesome/icons/check-circle";
import Icon from "vue-awesome/components/Icon";

export default {
	components: {
		"v-icon": Icon,
	},
	props: {
		direction: {
			type: Boolean,
			required: true
		},
		line: {
			type: Object,
			required: true
		},
		pointSize: {
			type: Number,
			required: true
		},
		showErrors: {
			type: Boolean,
			required: true
		},
		allDone: {
			type: Boolean,
			required: true,
		},
	},

	computed: {
		// показать что линия с ошибкой
		lineError (){
			return !this.line.correct && this.showErrors
		},
		// класс для line-inf
		lineClass (){
			return {
				'row': this.direction,
				'col': !this.direction,
				'unactive': this.line.done && !this.allDone,
				'error-line': this.lineError && !this.allDone
			}
		},
		// класс для иконок в зависимости от направления
		infIconContainerClass (){
			return {
				'icon-row': this.direction,
				'icon-col': !this.direction,
			}
		},
		// класс иконок в зависимости от сообщения
		infIconClass (){
			return {
				'icon-done': this.line.done,
				'icon-error': this.lineError
			}
		},
		numStyle (){
			return this.direction ?
				'width:' + (this.pointSize * 0.75) + 'px;':
				'height:' + (this.pointSize * 0.75) + 'px;';
		},
		
		// тип иконки
		iconName (){
			if (this.line.done) return 'check-circle'
			if (this.lineError) return 'exclamation-circle'
			return ''
		},
		// показывать иконку или нет
		showIcon (){
			return (this.line.done || this.lineError)  && !this.allDone
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_vars.scss';

.line-inf {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: $num-bg-color;

	.inf-icon {
		height: 60%;
		width: 60%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}
	.inf-icon.icon-done {
		color: $num-icon-done;
	}
	.inf-icon.icon-error {
		color: $num-icon-error;
	}
	.icon-row{
		position: relative;
		float: left;
	}
	.icon-col{
		position: relative;
	}

	.icon-scale-enter-active{
		animation: .2s iconIn;
	}

	.icon-scale-leave-active{
		animation: .2s iconOut;
	}

	@keyframes iconIn {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes iconOut {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(0);
		}
	}

}
.line-inf.unactive {
	background-color: $num-done-color;
	span {
		opacity: .5;
		text-decoration: line-through
	}
}
.line-inf.error-line {
	background-color: $num-err-color;
}

.nums-line{
	position: absolute;

	.num {
		display: block;
		position: relative;
		
		span {
			position: absolute;
			font-family: 'arial', sans-serif;
			color: $num-text-color;
		}
	}

	.num.unactive {
		opacity: .4;
		span {
			text-decoration: line-through
		}
	}
}
.line-inf.row .nums-line{
	height: 100%;
	right: 0;
	
	.num {
		float: left;
		height: 100%;

		span {
			display: block;
			width: calc(100% - 2px);
			text-align: center;
			padding-right: 2px;
			height: 1em;
			top: 0;
			bottom: 0;
			margin: auto 0;
		}
	}
}
.line-inf.col .nums-line{
	width: 100%;
	bottom: 0;

	.num {

		span {
			display: block;
			width: 100%;
			text-align: center;
		}
	}
}
</style>