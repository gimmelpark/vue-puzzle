import Vue from "vue"

import getters from './numsGetters'
import actions from './numsActions'

const state = () => ({

	// строки
	numRows: [],
	// столбцы
	numCols: [],

	// numLines: [
	// 	{
	// 		done: Boolean,
	// 		correct: Boolean,
	// 		nums: [
	// 			{
	// 				value: Number,
	// 				done: Boolean
	// 			}
	// 		]
	// 	}
	// ]
})

const mutations = {
	// нужно при создании
	addRow (state, blocks){
		state.numRows.push({
			nums: blocks,
			done: false,
			correct: true
		})
	},
	addCol (state, blocks){
		state.numCols.push({
			nums: blocks,
			done: false,
			correct: true
		})
	},

	// изменяет готовность линии
	setRowDone (state, {n, value}) {
		state.numRows[n].done = value
	},
	setColDone (state, {n, value}) {
		state.numCols[n].done = value
	},

	// изменняет корректность линии
	setRowCorrect (state, {n, value}) {
		state.numRows[n].correct = value
	},
	setColCorrect (state, {n, value}) {
		state.numCols[n].correct = value
	},

	// изменяет готовность блока
	setRowBlockDone (state, {n, m, value}) {
		state.numRows[n].nums[m].done = value
	},
	setColBlockDone (state, {n, m, value}) {
		state.numCols[n].nums[m].done = value
	},
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}
