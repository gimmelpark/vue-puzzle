import Vue from "vue"

import actions from './fieldActions'

const state = () => ({

	field: {},

	// двумерный объект
	// field: {
	// 	y: {
	// 		x: Number
	// 	}
	// }	

	fieldInfo: {},

	// доп инфа
	/*

	fieldInfo: {
		y: {
			x: {
				
				точка изменена пользователем (а не подсказками)
				altByUser: Boolean,
				
				напрвление зачеркивалки
				altDir: Boolean,
	
				превью при выделении
				controlView: Number,
	
				номер блока от которого был зачеркнут как соседний
				doneBlockNum: Number,
	
				направление блока от которого был зачеркнут как соседний
				doneBlockDir: Bolean,
			}
		}
	}

	*/

	// вариант адаптивности через изменение размера точки (вариант не доделан)
	maxPointSize: 25,
	minPointSize: 15,
	pointSize: 20,

	// фдаптивность деоается через scale
	gameScale: 1,

	// задержка отображения подсказок, мс
	promtTimeout: 500,

	// тип указателя: -1 - универсальный, остальные совпадают с устанавливаемым значением
	pointerType: -1,

	// настройки
	settings: [
		{
			groupID: 0,
			propertyID: 0,
			propertyName: 'Показывать ошибки',
			value: true,
		},
		{
			groupID: 0,
			propertyID: 1,
			propertyName: 'Вычеркивать клетки в заполненных линиях',
			value: true,
		},
		{
			groupID: 0,
			propertyID: 2,
			propertyName: 'Вычеркивать соседние клетки в заполненных блоках',
			value: false,
		},
		{
			groupID: 1,
			propertyID: 3,
			propertyName: 'Вычеркивать при долгом нажатии',
			value: false,
		},
		{
			groupID: 1,
			propertyID: 4,
			propertyName: 'Перезаписывать при выделении линии',
			value: true,
		},
	],

	// настройки по группам
	settingsGroups: [
		{
			id: 0,
			title: 'Подсказки',
			items: [],
		},
		{
			id: 1,
			title: 'Управление',
			items: [],
		},
	]
})

const getters = {
	// все и так понятно
	getPoinerType: (state) => state.pointerType,
	getPointSize: (state) => state.pointSize,
	getSettings: (state) => state.settingsGroups,
	getSettingByID: (state) => (id) => {
		return state.settings.find(item => item.propertyID == id)
	},
	getScale: (state) => state.gameScale,

	// размеры в клетках
	height (S, G, RS, rootGetters){
		return rootGetters['data/getHeight']
	},
	width (S, G, RS, rootGetters){
		return rootGetters['data/getWidth']
	},

	// размеры в пикселях
	getFieldWidth (state, getters) {
		let lineCount = getters.width % 5 == 0 ? parseInt(getters.width / 5) : parseInt(getters.width / 5)
		return state.pointSize * getters.width - 2 + lineCount
	},
	getFieldHeight (state, getters) {
		let lineCount = getters.height % 5 == 0 ? parseInt(getters.height / 5) - 1 : parseInt(getters.height / 5)
		return state.pointSize * getters.height - 2 + lineCount
	},

	// текущее состояние поля (объект)
	getField: (state) => state.field,

	// строка
	getRow: (state) => (y) => {
		return state.field[y]
	},
	// столбец
	getCol: (state) => (x) => {
		let col = {}
		for (let j in state.field) {
			col[String(j)] = state.field[j][x]
		}
		return col
	},

	// поле для превью (которое при выделении линией)
	getControlView: (state) => ({y, x}) => {
		return state.fieldInfo[y][x].controlView
	},

	// текущий прогресс
	getProgress (state, getters, RS, rootGetters) {
		let curr = 0
		for (let j = 0; j < getters.height; j++) {
			for (let i = 0; i < getters.width; i++) {
				if (state.field[j][i] == 1) curr++
			}
		}
		return curr / rootGetters['data/getPointCount']
	},
	
}

const mutations = {
	// создание поля
	createField (state, {H, W}){
		let f = {}
		let fInf = {}

		for (let j = 0; j < H; j++){
			f[String(j)] = {}
			fInf[String(j)] = {}

			for (let i = 0; i < W; i++){

				f[String(j)][String(i)] = 0

				fInf[String(j)][String(i)] = {
					altByUser: undefined,
					altDir: undefined,
					controlView: undefined,
					doneBlockNum: undefined,
					doneBlockDir: undefined,
				}
			}
		}
		state.field = f
		state.fieldInfo = fInf
	},

	// группировка настроек
	settingsToGroups (state){
		state.settingsGroups.forEach((group) => {
			group.items = state.settings.filter((setting) => {
				return setting.groupID == group.id
			})
		});
	},
	// изменение настройки
	setProperty (state, {id, value}){

		let ind = state.settings.findIndex(prop => prop.propertyID == id)
		
		if (ind != -1) state.settings[ind].value = value
		
	},

	// изменение точки
	setPoint (state, {y, x, value, byUser, altDir, doneBlockNum, doneBlockDir}){

		state.field[y][x] = value

		state.fieldInfo[y][x].altByUser = byUser
		state.fieldInfo[y][x].altDir = altDir
		state.fieldInfo[y][x].doneBlockNum = doneBlockNum
		state.fieldInfo[y][x].doneBlockDir = doneBlockDir
	},

	// изменение превью закрашивалки
	setControlView (state, {y, x, value}){
		state.fieldInfo[y][x].controlView = value
	},

	// изменение типа указателя
	setPointerType (state, value) {
		state.pointerType = value
	},

	setScalse (state, value) {
		state.gameScale = Math.min(1, Math.max(value, 0.5))
	},

	setPointSize (state, value) {
		state.pointSize = Math.min(state.maxPointSize, Math.max(value, state.minPointSize))
	},
	
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}