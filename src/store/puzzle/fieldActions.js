

export default {
    // инициализация
	fieldInit ({commit, rootGetters}) {
		commit('createField', {
			H: rootGetters['data/getHeight'],
			W: rootGetters['data/getWidth'],
		})

		commit('settingsToGroups')
	},

	// изменение параметра настроек
	setProperty ({commit, dispatch}, {id, value}) {
		
		// изменение
		commit('setProperty', {
			id: id,
			value: value,
		})

		// изменение settingsGroups
		commit('settingsToGroups')

		// проверка всего поля
		dispatch('allFieldCheck')
	},

	// изменение точки
	setPoint ({commit, dispatch, state}, {y, x, value, byUser, altDir, doneBlockNum, doneBlockDir}) {

		// изменение
		commit('setPoint', {
			y: y,
			x: x,
			value: value,
			byUser: byUser,
			altDir: altDir,
			doneBlockNum: doneBlockNum,
			doneBlockDir: doneBlockDir,
		})

		// задержка проверок
		setTimeout(function () {
					
			// проверка на ошибки
			dispatch('nums/checkLineCorrect', {
				dir: true,
				n: y
			}, {root: true})
			dispatch('nums/checkLineCorrect', {
				dir: false,
				n: x
			}, {root: true})

			// две проверки готовности колонки и строки

			dispatch('nums/checkLineDone', {
				dir: true, 
				n: y,
			}, {root: true})
			dispatch('nums/checkLineDone', {
				dir: false, 
				n: x,
			}, {root: true})
			
		}, state.promtTimeout)
		

	},

	// проверка всего поля (надо при изменении настроек или еще когда-то)
	allFieldCheck ({dispatch, getters}) {
		// по строкам
		for (let i = 0; i < getters.height; i++) {
			dispatch('nums/checkLineCorrect', {
				dir: true,
				n: i
			}, {root: true})
			dispatch('nums/checkLineDone', {
				dir: true, 
				n: i,
			}, {root: true})
		}
		// по столбцам
		for (let i = 0; i < getters.width; i++) {
			dispatch('nums/checkLineCorrect', {
				dir: false,
				n: i
			}, {root: true})
			dispatch('nums/checkLineDone', {
				dir: false, 
				n: i,
			}, {root: true})
		}
	},

	// вычеркивание клеток в готовой линии
	lineDoneDel ({getters, state, dispatch}, {dir, n, order}){

		// проверка настроек
		if (getters.getSettingByID(1).value) {

			let N = dir ? getters.width : getters.height;
			let x, y, a;
	
			for (let i = 0; i < N; i++){
				x = dir ? i : n;
				y = dir ? n : i;
				a = state.field[y][x];
	
				// если строка готова, вычеркиваем пустые
				if (order) { 
					if (a != 1 && a != 2) {
						dispatch('setPoint', {
							y: y,
							x: x,
							value: 2,
							byUser: false,
							altDir: dir,
						})
					}
	
				// если строка была готова, обнуляем то что вычеркнули
				} else {
					let fInf = state.fieldInfo[y][x]
					if (a == 2 && fInf.altByUser === false && fInf.altDir === dir) {
						dispatch('setPoint', {
							y: y,
							x: x,
							value: 0,
							byUser: undefined,
						})
					}
				}
				
			}
		}
		
	},

	// вычеркивание соседних с готовым блоком клеток
	blockDoneDel ({getters, dispatch, state}, {dir, n, m, num, pos}) {
		let x, y

		// первая соседняю точка
		if (pos > 0) {
			y = dir ? n : pos - 1
			x = dir ? pos - 1 : n

			if (state.field[y][x] != 2) {
				dispatch('setPoint', {
					y: y,
					x: x,
					value: 2,
					byUser: false,
					doneBlockDir: dir,
					doneBlockNum: m,
				})
			}
		}
		
		// вторая соседняя точка
		let lineLength = dir ? getters.width : getters.height

		if ((pos + num) < lineLength) {
			y = dir ? n : pos + num
			x = dir ? pos + num : n
			
			if (state.field[y][x] != 2) {
				dispatch('setPoint', {
					y: y,
					x: x,
					value: 2,
					byUser: false,
					doneBlockDir: dir,
					doneBlockNum: m,
				})
			}
		}
	},

	// отмена вычеркивания соседних с блоком клеток если блок больше не готов
	blockDoneDelReset ({getters, state, dispatch}, {dir, n, m}) {

		let lineLength = dir ? getters.width : getters.height

		let y, x

		for (let i = 0; i < lineLength; i++) {
			y = dir ? n : i
			x = dir ? i : n

			if (
				state.fieldInfo[y][x].doneBlockDir === dir &&
				state.fieldInfo[y][x].doneBlockNum == m &&
				!state.fieldInfo[y][x].altByUser
			) {
				dispatch('setPoint', {
					y: y,
					x: x,
					value: 0,
					byUser: undefined,
					doneBlockDir: undefined,
					doneBlockNum: undefined,
				})
			}
		}
	},


	// нажатие на точку
	pointClick ({state, dispatch}, {y, x}){

		let value = state.pointerType

		if (state.pointerType == state.field[y][x]) value = 0

		if (value == -1) value = state.field[y][x] < 2 ? state.field[y][x] + 1 : 0

		dispatch('setPoint', {
			y: y,
			x: x,
			value: value,
			byUser: true
		})
	},

	// долгое нажатие
	pointLongClick ({dispatch}, {y, x}){
		dispatch('setPoint', {
			y: y,
			x: x,
			value: 2,
			byUser: true
		})
	},

	// закрашивание линии которую выделил игрок
	mouseMoveLine ({state, dispatch, getters}, {y, x, dir, length}){

		// перезаписывать отмеченные клетки?
		let rewrite = getters.getSettingByID(4).value

		// значение линии
		let value = state.pointerType
		// если универсальный указатель
		if (value == -1) value = state.field[y][x] < 2 ? state.field[y][x] + 1 : 0

		// направление выделения
		let order = length > 0 ? 1 : -1

		// длинна выделения
		length = Math.abs(length)

		// погнали
		let i = 0
		let curX, curY
		
		let timer = setInterval(function () {

			if (i > length) {
				clearInterval(timer)
			} else {

				curY = +(dir ? y : +y + order * i)
				curX = +(dir ? +x + order * i : x)

				// проверка надо ли перезаписывать
				if ((!rewrite && state.field[curY][curX] == 0) || rewrite || value == 0) {
					dispatch('setPoint', {
						y: curY,
						x: curX,
						value: value,
						byUser: true
					})
				}
	
				i++
			}

		}, 15)

		dispatch('controlViewReset')
		
	},

	// сброс отображения выделенной линии
	controlViewReset ({commit, getters}) {
		for (let j = 0; j < getters.height; j++) {
			for (let i = 0; i < getters.width; i++) {
				commit('setControlView', {
					y: j,
					x: i,
					value: undefined
				})
			}
		}
	},

	// отображение выделенной линии
	controlViewLine ({state, commit, dispatch, getters}, {y, x, dir, length}) {

		dispatch('controlViewReset')

		let rewrite = getters.getSettingByID(4).value

		let value = state.pointerType

		if (value == -1) value = state.field[y][x] < 2 ? state.field[y][x] + 1 : 0

		let order = length > 0 ? 1 : -1

		length = Math.abs(length)

		let curX, curY

		for (let i = 0; i <= length; i++) {

			curY = +(dir ? y : +y + order * i)
			curX = +(dir ? +x + order * i : x)

			if ((!rewrite && state.field[curY][curX] == 0) || rewrite || value == 0) {
				commit('setControlView', {
					y: curY,
					x: curX,
					value: value,
				})
			}
		}

	},

	// установки типа указателя
	setPointerType ({commit}, value) {
		if (value >= -1 && value <= 3) {
			commit('setPointerType', value)
		}
	},

	// перерасчет масштаба
	wrapperResize ({state, commit}, {wrppWidth, wrppHeight, width, height}) {

		let indentX = 10
		let indentY = 10

		let maxScaleX = 1
		let maxScaleY = 1

		if (
			(width + indentX * 2) > wrppWidth || 
			((width + indentX * 2) < wrppWidth && state.gameSceleX < 1)
		) {
			maxScaleX = wrppWidth / (width + indentX * 2)
		}

		if (
			(height + indentY * 2) > wrppHeight ||
			((height + indentY * 2) < wrppHeight && state.gameSceleY < 1)
		) {
			maxScaleY = wrppHeight / (height + indentY * 2)
		}

		let maxScale = Math.min(maxScaleX, maxScaleY, 1)

		if (maxScale != state.gameScele) {
			commit('setScalse', maxScale)
		}

	}



}