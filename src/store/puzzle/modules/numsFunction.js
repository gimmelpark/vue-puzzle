
// считает блоки закрашенных клеток
const createLineBlocks = (line) => {
	let blocks = [];
	let blockSize = 0;

	line.forEach((point) => {
		if (point == 1) {
			blockSize++;
		} else {
			if (blockSize > 0) blocks.push(blockSize)
			blockSize = 0;
		}
	});
	if (blockSize > 0) blocks.push(blockSize)

	return blocks;
}

// объект строки или столбца из field в массив
const objToArr = (obj) => {
	let arr = []
	for (let key in obj) {
		arr.push(obj[key])
	}
	return arr;
}

// расчет ошибки и готовности блока

// минимальная позиция для блоков nums с позицией numsPos (расчитывается для тех которые undefined)
const calcMinPos = (nums, numsPos) => {
	let pos = []
	let curMinPos = 0

	if (numsPos === undefined) numsPos = Array(nums.length).fill(undefined)

	nums.forEach((num, i) => {
		curMinPos = numsPos[i] === undefined ? curMinPos : numsPos[i]
		pos.push(curMinPos)
		curMinPos += (num + 1)
	})

	return pos
}

// индекс последнего элемента, который можно сдвинуть дальше (nums - блоки, numsPos - их позиции, L - длинна строки)
const calcNextInd = (nums, numsPos, L) => {
	let nextInd = undefined

	nums.forEach((num, i) => {
		if (i < numsPos.length - 1) {
			if ((numsPos[i] + num + 1) < numsPos[i + 1]){
				nextInd = i
			}
		} else {
			if ((numsPos[i] + num) < L) {
				nextInd = i
			}
		}
	})

	return nextInd
}

// следующая после numPos позиция блоков nums
const calcNextPos = (nums, numsPos, L) => {

	let nextInd = calcNextInd(nums, numsPos, L)

	if (nextInd === undefined) return undefined

	let nextPos = numsPos.map((pos, i) => {
		if (i < nextInd) return pos
		if (i == nextInd) return pos + 1
		return undefined
	})

	return calcMinPos(nums, nextPos)
}

// сравнивает линию line с позицией numsPos блоков nums
const checkPos = (nums, numsPos, line) => {

	let lineNums = Array(line.length).fill(0)

	numsPos.forEach((pos, i) => {
		for (let j = pos; j < pos + nums[i]; j++) {
			lineNums[j] = 1
		}
	})

	return line.every((point, i) => {
		if (point == 1) return lineNums[i] == 1
		if (point == 2) return lineNums[i] == 0
		return true
	})
}

// возвращает массив возможных вариантов расположения блоков nums для lines
const checkLine = (nums, line) => {
	let possiblePositions = []
	let numsPos = calcMinPos(nums)

	while (numsPos !== undefined) {
		if (checkPos(nums, numsPos, line)) possiblePositions.push(numsPos)
		numsPos = calcNextPos(nums, numsPos, line.length)
	}

	return possiblePositions
}

// определяет, готов ли блок с индексом m  из блоков nums
const checkBlock = (nums, line, m, possiblePositions) => {

	if (possiblePositions.length == 0) return false

	let positions = possiblePositions.map((posArr) => {
		return posArr[m]
	})

	if (positions.some((pos) => pos != positions[0])) return false

	for (let i = positions[0]; i < positions[0] + nums[m]; i++) {
		if (line[i] != 1) return false
	}

	return true
}

// возвращает позицию блока m из блоков nums, если блок не готов, возвращает false
const getBlockPos = (nums, line, m) => {

	let possiblePositions = checkLine(nums, line)

	if (!checkBlock(nums, line, m, possiblePositions)) return false

	return possiblePositions[0][m]

}

export default {
	createLineBlocks,
	objToArr,
	checkLine,
	getBlockPos,
}

