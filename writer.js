const symbolTables = require('./symbol_table')

function addArrayElement(arrElement, i, container, arrLength, funcContainerNotice) {
	let result = ''

	if (i === 0) {
		result += '['
		container.isLitArr = true
	}
	if (i + 1 === arrLength) {
		if (container.isLetLambArg && arrElement[0] !== 'define') {
			result += 'return '
		}
	}

	result += writeJS(arrElement, container.isFuncArg || container.isLitArr)

	if (i + 1 === arrLength) {
		if (container.isLitArr) {
			result += '], '
		} else if (funcContainerNotice) {
			result += '), '
		} else {
			result += '); '
		}
	}

	return {
		result: result,
		isLitArr: container.isLitArr
	}
}

function addTokenElement(arrElement_0, currentArrElement, i, container, arrLength, funcContainerNotice) {
	let result = ''

	if (i === 0) {
		result += '['
		container.isLitArr = true
	}

	if (i + 1 === arrLength) {
		if (container.isLetLambArg) {
			result += `return ${currentArrElement}`
		} else {
			result += `${currentArrElement}`
		}
		if (container.isLitArr) {
			result += '], '
		} else if (funcContainerNotice) {
			result += '), '
		} else {
			result += '); '
		}
	} else {
		if (i === 1 && arrElement_0 === 'set!') {
			result += `'${currentArrElement}', `
		} else {
			result += `${currentArrElement}, `
		}
	}

	return {
		result: result,
		isLitArr: container.isLitArr
	}
}

function writeJS(array, funcContainerNotice) {
	let result = ''
	let helperResult
	let container = {
		isLitArr: false,
		isFuncArg: false,
		isLetLambArg: false,
		noSymbolMatch: false
	}

	for (let i=0; i<array.length; i++) {
		if (Array.isArray(array[i])) {
			helperResult = addArrayElement(array[i], i, container, array.length, funcContainerNotice)
			result += helperResult.result
			container.isLitArr = helperResult.isLitArr
		} else {
			helperResult = symbolTables.symbols(array[i], container.isFuncArg, container.isLetLambArg)
			result += helperResult.result
			container.isFuncArg = helperResult.isFuncArg
			container.isLetLambArg = helperResult.isLetLambArg
			container.noSymbolMatch = helperResult.noSymbolMatch

			if (container.noSymbolMatch) {
				helperResult = addTokenElement(array[0], array[i], i, container, array.length, funcContainerNotice)
				result += helperResult.result
				container.isLitArr = helperResult.isLitArr
			}
		}
	}

	return result
}

module.exports = writeJS
