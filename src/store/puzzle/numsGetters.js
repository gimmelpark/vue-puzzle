
import numsF from './modules/numsFunction.js'

export default {
	getRows: (state) => state.numRows,
	getCols: (state) => state.numCols,
	getLine: (S, getters) => (dir) => {
		return dir ? getters.getRows : getters.getCols
	},

	// максимальное колличество блоков
	getMaxLength: (state) => (dir) => {
		return dir ? 
			state.numRows.reduce((L, row) => {
				return Math.max(L, row.nums.length)
			}, 0) : 
			state.numCols.reduce((L, col) => {
				return Math.max(L, col.nums.length)
			}, 0)
	},

	getColsHeight (S, getters, RS, rootGetters) {
		return rootGetters['field/getPointSize'] * 0.75 * (getters.getMaxLength(false)) + rootGetters['field/getPointSize']
	},
	getRowsWidth (S, getters, RS, rootGetters) {
		return rootGetters['field/getPointSize'] * 0.75 * (getters.getMaxLength(true)) + rootGetters['field/getPointSize']
	},

	// объект линии в массив длинн блоков
	numsToArr: (state) => ({dir, n}) => {
		let numsObj = dir ? state.numRows[n].nums : state.numCols[n].nums;
		let numsArr = []

		for (let key in numsObj) {
			numsArr.push(numsObj[key].value)
		}

		return numsArr
	},

	// проверка готовности линии
	isLineDone: (S, getters) => ({dir, n}) => { 

		let nums = getters.getLine(dir)[n].nums

		return nums.every((num) => num.done)
	},

	// проверка линии на ошибки
	isLineCorrect: (S, getters, RS, rootGetters) => ({dir, n}) => {
		let nums = getters.numsToArr({
			dir: dir,
			n: n
		})

		let line = numsF.objToArr(
			dir ? 
			rootGetters['field/getRow'](n) :
			rootGetters['field/getCol'](n)
		)

		return numsF.checkLine(nums, line).length > 0
	},

	// готовность блока
	isBlockDone: (S, getters, RS ,rootGetters) => ({dir, n, m}) => {
		let nums = getters.numsToArr({
			dir: dir,
			n: n
		})

		let line = numsF.objToArr(
			dir ? 
			rootGetters['field/getRow'](n) :
			rootGetters['field/getCol'](n)
		)

		return numsF.getBlockPos(nums, line, m)
	},

	isAllDone (S, getters) {
		let rowsDone = !getters.getRows.some((row) => {
			return !row.done
		})
		let colsDone = !getters.getCols.some((col) => {
			return !col.done
		})
		return rowsDone && colsDone
	},
	isAllCorrect (S, getters) {
		let rowsCorrect = !getters.getRows.some((row) => {
			return !row.correct
		})
		let colsCorrect = !getters.getCols.some((col) => {
			return !col.correct
		})
		return rowsCorrect && colsCorrect
	}
}