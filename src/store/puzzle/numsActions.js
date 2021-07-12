
import numsF from './modules/numsFunction.js'

export default {
    // инициализация
	numsInit ({commit, rootGetters}) {
		rootGetters['data/getPuzzle'].forEach((row) => {
			let line = numsF.createLineBlocks(row)
			commit('addRow', line.map((n) => {
				return {
					value: n,
					done: false
				}
			}))
		});
		rootGetters['data/getColumns'].forEach((col) => {
			let line = numsF.createLineBlocks(col)
			commit('addCol', line.map((n) => {
				return {
					value: n,
					done: false
				}
			}))
		});
	},

	// изменяет готовность линии
	setLineDone ({commit, dispatch, getters}, {dir, n}) {

		let currDone = getters.getLine(dir).done

		let newDone = getters.isLineDone ({
			dir: dir,
			n: n
		})

		if (currDone !== newDone) {
			commit(dir ? 'setRowDone' : 'setColDone', {
				n: n, 
				value: newDone
			})
	
			// вызов вычеркивалки
			
			dispatch('field/lineDoneDel', {
				dir: dir, 
				n: n,
				order: newDone
			}, {root: true})
		}
		
	},

	// проверка по линии
	checkLineDone ({getters, commit, dispatch, rootGetters}, {dir, n}) {

		let nums = getters.getLine(dir)[n].nums

		let blockDoneDelSetting = rootGetters['field/getSettingByID'](2).value

		// цикл по блокам
		nums.forEach((num, i) => {
			// состояние блока
			let pos = getters.isBlockDone({
				dir: dir,
				n: n,
				m: i
			})

			let isDone = pos === false ? false : true

			if (num.done != isDone) {
				//  записываем
				commit(
					dir ? 
					'setRowBlockDone' :
					'setColBlockDone',
				{
					dir: dir, 
					n: n, 
					m: i,
					value: isDone
				})


				// отмена вычеркивания соседних
				if (blockDoneDelSetting) {
					if (!isDone) {
						dispatch('field/blockDoneDelReset', {
							dir: dir,
							n: n,
							m: i,
						}, {root: true})
					}
				}

			}

			// вычеркиваем соседние с готовым
			if (blockDoneDelSetting) {
				if (isDone) {
					dispatch('field/blockDoneDel', {
						dir: dir,
						n: n,
						m: i,
						num: num.value,
						pos: pos,
					}, {root: true})
				}
			}
		})

		// меняем готовность линии
		dispatch('setLineDone', {
			dir: dir,
			n: n
		})

	},

	

	// проверка на ошибки
	checkLineCorrect ({commit, getters, dispatch}, {dir, n}) {
		// результат проверки
		let correct = getters.isLineCorrect({
			dir: dir,
			n: n
		})

		// записываем результат
		commit(
			dir ? 
			'setRowCorrect' : 
			'setColCorrect' ,
		{
			n: n,
			value: correct
		})

		// если ошибка, отменяем готовность линии
		if (!correct) {
			dispatch('setLineDone', {
				dir: dir,
				n: n,
				value: false
			})
		}

	}

}