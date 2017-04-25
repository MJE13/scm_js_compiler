
let userSymbols = {}

function symbols(arrElement, isFuncArg, isLetLambArg) {
	let result = ''
	let noSymbolMatch = false

	switch (arrElement) {
		case '+':
			result += '_schemeAdd('
			isFuncArg = true
			break
		case '-':
			result += '_schemeSubtract('
			isFuncArg = true
			break
		case '*':
			result += '_schemeMult('
			isFuncArg = true
			break
		case '/':
			result += '_schemeDivide('
			isFuncArg = true
			break
		case '=':
			result += '_schemeEquals('
			isFuncArg = true
			break
		case 'eq?':
			result += '_schemeEquals('
			isFuncArg = true
			break
		case 'pair?':
			result += '_schemePair('
			isFuncArg = true
			break
		case '>':
			result += '_schemeGreater('
			isFuncArg = true
			break
		case '<':
			result += '_schemeLess('
			isFuncArg = true
			break
		case '>=':
			result += '_schemeGreaterOrEqual('
			isFuncArg = true
			break
		case '<=':
			result += '_schemeLessOrEqual('
			isFuncArg = true
			break
		case 'null?':
			result += '_schemeIsNull('
			isFuncArg = true
			break
		case 'if':
			result += '_schemeIf('
			isFuncArg = true
			break
		case 'not':
			result += '_schemeNot('
			isFuncArg = true
			break
		case 'cond':
			result += '_schemeCond('
			isFuncArg = true
			break
		case 'else':
			result += '_schemeElse('
			isFuncArg = true
			break
		case 'car':
			result += '_schemeCar('
			isFuncArg = true
			break
		case 'cdr':
			result += '_schemeCdr('
			isFuncArg = true
			break
		case 'cons':
			result += '_schemeCons('
			isFuncArg = true
			break
		case 'and':
			result += '_schemeAnd('
			isFuncArg = true
			break
		case 'or':
			result += '_schemeOr('
			isFuncArg = true
			break
		case 'set!':
			result += '_schemeSet('
			isFuncArg = true
			break
		case 'let':
			result += '_schemeLet('
			isLetLambArg = true
			break
		case 'define':
			result += '_schemeDefine('
			isFuncArg = true
			break
		case 'lambda':
			result += '_schemeLambda('
			isLetLambArg = true
			break
		case 'autoLambda':
			result += '_schemeAutoLambda('
			isFuncArg = true
			isLetLambArg = true
			break
		default:
			noSymbolMatch = true
	}

	return {
		result: result,
		isFuncArg: isFuncArg,
		isLetLambArg: isLetLambArg,
		noSymbolMatch: noSymbolMatch
	}
}

module.exports = {
	symbols,
	userSymbols
}
