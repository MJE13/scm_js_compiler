const symbolTables = require('./symbol_table')

function addArrayElement(currentArrElement, arrElement_0, i, container, arrLength, funcContainerNotice) {
	let result = ''

	if (i === 0) {
		result += '['
		container.isLitArr = true
	}
	if (i + 1 === arrLength) {
		if (container.isLetLambArg && currentArrElement[0] !== 'define') {
			result += 'return '
		}
	}

	result += writeJS(currentArrElement, container.isFuncArg || container.isLitArr)

	if (i + 1 === arrLength) {
		if (container.isLitArr) {
			if (symbolTables.userSymbols[arrElement_0]) {
				if (funcContainerNotice) {
					result += '], '
				}
				else {
					result += ']; '
				}
			} else {
				result += '], '
			}
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
	debugger;
	if (symbolTables.userSymbols[currentArrElement] === true) {
		debugger;
		currentArrElement = currentArrElement.replace(/\?$/, '')
		if (funcContainerNotice) {
			container.isFuncArg = true
		}
	}

	if (i === 0) {
		result += '['
		if (symbolTables.userSymbols[arrElement_0]) {
			result += '36ldv9nw6f5s15'
		}
		container.isLitArr = true
	}

	if (i + 1 === arrLength) {
		if (container.isLetLambArg) {
			result += `return ${currentArrElement}`
		} else {
			result += `${currentArrElement}`
		}
		if (container.isLitArr) {
			if (symbolTables.userSymbols[arrElement_0]) {
				if (funcContainerNotice) {
					result += '], '
				}
				else {
					result += ']; '
				}
			} else {
				result += '], '
			}
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
		isLitArr: container.isLitArr,
		isFuncArg: container.isFuncArg
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
			helperResult = addArrayElement(array[i], array[0], i, container, array.length, funcContainerNotice)
			result += helperResult.result
			container.isLitArr = helperResult.isLitArr
		} else {
			helperResult = symbolTables.symbols(array[i], container.isFuncArg, container.isLetLambArg)
			result += helperResult.result
			container.isFuncArg = helperResult.isFuncArg
			container.isLetLambArg = helperResult.isLetLambArg
			container.noSymbolMatch = helperResult.noSymbolMatch

			if (helperResult.result === '_schemeDefine(') {
				symbolTables.userSymbols[array[i+1]] = true
			}

			if (container.noSymbolMatch) {
				helperResult = addTokenElement(array[0], array[i], i, container, array.length, funcContainerNotice)
				result += helperResult.result
				container.isLitArr = helperResult.isLitArr
				container.isFuncArg = helperResult.isFuncArg
			}
		}
	}

	return result
}

module.exports = writeJS
