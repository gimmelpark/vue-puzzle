const state = () => ({
	// размеры h * w
	size: getSizeQ (),
	// пазл строкой
	puzzleLine: getPuzzleQ (),
	// пазл матрицей
	puzzle: [],
	// количество закрашенных точек
	pointCount: undefined,
})

const getters = {
	getHeight: (state) => state.size[0],
	getWidth: (state) => state.size[1],
	// одна точка
	getPoint: (state) => ({y, x}) => state.puzzle[y][x],
	//  одна строка
	getRow: (state) => (y) => state.puzzle[y],
	// один столбец
	getCol: (state) => (x) => {
		let col = state.puzzle.map((row) => {
			return row[x]
		})
		return col
	},
	// все строки
	getPuzzle: (state) => state.puzzle,
	// все столбцы
	getColumns: (state, getters) => {
		let cols = state.puzzle[0].map((col, i) => {
			return getters.getCol(i)
		})
		return cols
	},
	getPointCount: (state) => state.pointCount
}

const mutations = {
	// создание матрицы
	createPuzzle (state, {H, W}) {
		let field = []
		let count = 0
		for (let j = 0; j < H; j++){
			field.push([])
			for (let i = 0; i < W; i++){
				field[j].push(state.puzzleLine[j * W + i])
				if (state.puzzleLine[j * W + i] == 1) count++
			}
		}
		state.puzzle = field
		state.pointCount = count
	},
}

const actions = {
	// инициализация
	dataInit ({commit, getters}) {
		commit('createPuzzle', {
			H: getters.getHeight,
			W: getters.getWidth
		})
		
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}


function getSizeQ () {
	return [20, 15]
}

function getPuzzleQ () {
	return [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
}