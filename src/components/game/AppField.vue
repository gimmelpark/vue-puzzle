<template>
	<div 
		id="puzzle-field" 
		:style="fieldStyle"
		ref="field-wrapper"

		@pointerleave="mouseUp($event, true)" 

		@touchstart="eventPrev"
		@dragstart="eventPrev"
		
		@pointerdown="mouseDown"
		@pointermove="mouseMove"
		@pointerup="mouseUp"
	>
		<div 
			v-for="(row, y) in field" 
			:key="'row-' + y" 
			:style="'height: ' + (pointSize - 1) + 'px;'"
			class="field-row"
			:class="lineClassY(y)"
		>
			<div 
				v-for="(point, x) in field[y]"
				:key="'pt-r' + y + 'c' + x"
				:style="'width: ' + (pointSize - 1) + 'px;'"
				class="field-col"
				:class="lineClassX(x)"
			>
				<app-point
					:pointValue="field[y][x]"
					:controlView="controlView({y: y, x: x})"
					:allDone="allFieldDone"
					@pointClick="pointClick($event, y, x)"
					@pointLongClick="pointLongClick($event, y, x)"
				></app-point>
			</div>
			
		</div>
	</div>
</template>

<script>

import AppPoint from '@/components/game/AppPoint.vue'

import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
		AppPoint
	},
	data: () => ({
		isMouseDown: false,
		mouseMoveDir: undefined,
		mouseMoveLength: 0,
		mouseMoveX: undefined,
		mouseMoveY: undefined,
		mouseDX: undefined,
		mouseDY: undefined,
		isItLine: false,
	}),
	computed: {
		...mapGetters ('field', {
			field: 'getField',
			pointSize: 'getPointSize',
			controlView: 'getControlView',
			fieldHeight: 'getFieldHeight',
			fieldWidth: 'getFieldWidth',
			scale: 'getScale',
		}),
		...mapGetters ('data', {
			height: 'getHeight',
			width: 'getWidth'
		}),
		...mapGetters('nums', {
			allDone: 'isAllDone',
			allCorrect: 'isAllCorrect',
		}),

		fieldStyle () {
			return 'height: ' + this.fieldHeight + 'px;width:' + (this.fieldWidth) + 'px;'
		},

		allFieldDone () {
			return this.allDone && this.allCorrect
		},

	},
	methods: {
		...mapActions ('field', {
			setPoint: 'pointClick',
			setLine: 'mouseMoveLine',
			controlLine: 'controlViewLine',
			longClick: 'pointLongClick',
		}),

		// класс для вертикальных полосок
		lineClassX (x) {
			return {
				'col-line': x % 5 == 4 && x != this.width - 1,
				'line-none': x == this.width - 1,
			}
		},
		// класс для горизонтальных полосок
		lineClassY (y) {
			return {
				'row-line': y % 5 == 4 && y != this.height - 1,
				'line-none': y == this.height - 1,
			}
		},

		// обработка клика
		pointClick (e, y, x) {
			if (!this.isItLine) {
				this.setPoint({y: y, x: x})
			}
			
		},

		pointLongClick (e, y, x) {
			if (!this.isItLine) {
				this.longClick({y: y, x: x})
			}
		},

		// отмена события
		eventPrev (e) {
			e.preventDefault()
		},

		// положение события e относительно field
		pointerY (e) {
			let y = e.y - (this.$refs['field-wrapper'].getBoundingClientRect().top + this.$refs['field-wrapper'].clientTop)
			return Math.max(0, Math.min(parseInt(this.fieldHeight), y)) / this.scale
		},
		pointerX (e) {
			let x = e.x - (this.$refs['field-wrapper'].getBoundingClientRect().left + this.$refs['field-wrapper'].clientLeft)
			return Math.max(0, Math.min(parseInt(this.fieldWidth), x)) / this.scale
		},
		
		// номер строки или столбца из координат
		posToInd (l) {
			let n = 0

			let pSize = this.pointSize

			while (l >= 0) {
				if (l >= (pSize * 5 + 1)) {
					l -= (pSize * 5 + 1)
					n += 5
				} else {
					n += parseInt(l / pSize)
					return n
				}
			}
			
			return n
		},

		// начало выделения линии
		mouseDown (e) {
			this.isMouseDown = true;
			this.mouseMoveY = this.posToInd(this.pointerY(e))
			this.mouseMoveX = this.posToInd(this.pointerX(e))
		},

		// движение при выделении
		mouseMove (e){
			
			if (this.isMouseDown) {
				
				// расчет позиции указателя
				let y = this.posToInd(this.pointerY(e))
				let x = this.posToInd(this.pointerX(e))

				// расчет изменения координаты
				this.mouseDY = y - this.mouseMoveY
				this.mouseDX = x - this.mouseMoveX

				// расчет направления и длинны линии (длинна может быть отрицательной)
				this.mouseMoveDir = Math.abs(this.mouseDX) > Math.abs(this.mouseDY)
				this.mouseMoveLength = this.mouseMoveDir ? this.mouseDX : this.mouseDY;

				if (this.mouseMoveLength != 0) this.isItLine = true

				if (this.isItLine && !this.allFieldDone) {
					this.controlLine({
						y: this.mouseMoveY,
						x: this.mouseMoveX,
						dir: this.mouseMoveDir,
						length: this.mouseMoveLength
					})
				}
				
				
			}
		},

		// конец выделения
		mouseUp (e, outOfField) {
			
			if (this.isMouseDown) {

				// передавать outOfField = true если нет эвента с координатами
				if (outOfField === undefined) {
					// расчет позиции указателя
					let y = this.posToInd(this.pointerY(e))
					let x = this.posToInd(this.pointerX(e))

					this.mouseDY = y - this.mouseMoveY
					this.mouseDX = x - this.mouseMoveX
				}

				// расчет направления и длинны
				this.mouseMoveDir = Math.abs(this.mouseDX) > Math.abs(this.mouseDY)
				this.mouseMoveLength = this.mouseMoveDir ? this.mouseDX : this.mouseDY;

				// вызов функции закрашивалки
				if (this.isItLine  && !this.allFieldDone) {
						this.setLine({
						y: this.mouseMoveY,
						x: this.mouseMoveX,
						dir: this.mouseMoveDir,
						length: this.mouseMoveLength
					})
				}

				// сброс значений
				this.mouseDy = undefined
				this.mouseDX = undefined
				this.mouseMoveDir = undefined
				this.mouseMoveLength = 0
				this.isMouseDown = false
				this.isItLine = false

			}
		},

	}

}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_vars.scss';

#puzzle-field {
	position: relative;
	border-left: 3px solid $toll-line-color;
	border-top: 3px solid $toll-line-color;
	float: right;
	background-color: $field-bg-color;

	.field-row {
		overflow: hidden;
		width: calc(100% + 1px);
		border-bottom: 1px solid $line-color;
	}
	.field-row.row-line {
		border-bottom: 2px solid $toll-line-color;
	}
	.field-row.line-none {
		border-bottom: none;
	}

	.field-col {
		float: left;
		height: 100%;
		border-right: 1px solid $line-color;
	}
	.field-col.col-line{
		border-right: 2px solid $toll-line-color;
	}

	.field-col.line-none {
		border-right: none;
	}
}
</style>