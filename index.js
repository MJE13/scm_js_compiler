const fs = require('fs')
const util = require('util')
const scheme = fs.readFileSync('src.scm', 'utf8')

let result = ''

function writeJS(array, funcOrArrContainer) {
	let isLitArr = false
	let isFuncArgs = false
	let isLetLambArg = false
	for (let i=0; i<array.length; i++) {
		debugger;
		if (Array.isArray(array[i])) {
			if (i === 0) {
				result += '['
				isLitArr = true
			}
			if (i + 1 === array.length) {
				if (isLetLambArg) {
					result += 'return '
				}
			}
			writeJS(array[i], isFuncArgs || isLitArr)
			debugger;
			if (i + 1 === array.length) {
				if (isLitArr) {
					result += '], '
				} else if (funcOrArrContainer) {
					result += '), '
				} else {
					result += '); '
				}
			}
		} else {
			switch (array[i]) {
				case '+':
					result += '_schemeAdd('
					isFuncArgs = true
					break
				case '-':
					result += '_schemeSubtract('
					isFuncArgs = true
					break
				case '*':
					result += '_schemeMult('
					isFuncArgs = true
					break
				case '/':
					result += '_schemeDivide('
					isFuncArgs = true
					break
				case '=':
					result += '_schemeEquals('
					isFuncArgs = true
					break
				case 'eq?':
					result += '_schemeEquals('
					isFuncArgs = true
					break
				case '>':
					result += '_schemeGreater('
					isFuncArgs = true
					break
				case '<':
					result += '_schemeLess('
					isFuncArgs = true
					break
				case '>=':
					result += '_schemeGreaterOrEqual('
					isFuncArgs = true
					break
				case '<=':
					result += '_schemeLessOrEqual('
					isFuncArgs = true
					break
				case 'null?':
					result += '_schemeIsNull('
					isFuncArgs = true
					break
				case 'if':
					result += '_schemeIf('
					isFuncArgs = true
					break
				case 'cond':
					result += '_schemeCond('
					isFuncArgs = true
					break
				case 'else':
					result += '_schemeElse('
					isFuncArgs = true
					break
				case 'car':
					result += '_schemeCar('
					isFuncArgs = true
					break
				case 'cdr':
					result += '_schemeCdr('
					isFuncArgs = true
					break
				case 'cons':
					result += '_schemeCons('
					isFuncArgs = true
					break
				case 'let':
					result += '_schemeLet('
					isLetLambArg = true
					break
				case 'and':
					result += '_schemeAnd('
					isFuncArgs = true
					break
				case 'or':
					result += '_schemeOr('
					isFuncArgs = true
					break
				case 'set!':
					result += '_schemeSet('
					isFuncArgs = true
					break
				case 'lambda':
					result += '_schemeLambda('
					isLetLambArg = true
					break
				/*case 'define':
					result += 'var '
					break*/
				default:
					if (i === 0) {
						result += '['
						isFuncArgs = true
						isLitArr = true
					}
					if (i + 1 === array.length) {
						if (isLetLambArg) {
							result += `return ${array[i]}`
						} else {
							result += `${array[i]}`
						}
						if (isLitArr) {
							result += '], '
						} else if (funcOrArrContainer) {
							result += '), '
						} else {
							result += '); '
						}
					} else {
						if (i === 1 && array[0] === 'set!') {
							result += `'${array[i]}', `
						} else {
							result += `${array[i]}, `
						}
					}
			}
		}
	}
}

function tokenize(arr) {
	for (let i=0; i<arr.length; i++) {
		if(Array.isArray(arr[i])){
			tokenize(arr[i])
			if (Array.isArray(arr[i][0]) && arr[i].length === 1) {
				if (!(i === 1 && arr[i-1] === 'let')) {
					arr[i] = arr[i][0]
				}
			}
		} else {
			if (/ /.test(arr[i])) {
				let subArr = arr[i].split(' ')
				arr[i] = subArr[0]
				for (let j=1; j<subArr.length; j++) {
					arr.splice(i + j, 0, subArr[j])
				}
				i += subArr.length - 1
			}
		}
	}
	return arr
}

function makeTree(str) {
	str = '(let ((_schemeglobalScope 0)) ' + str + ')'
	str = str.replace(/".*?"/g, match => match.replace(/ /g, '#$%&!?@'))
	str = str.replace(/"/g, '@?&@%&!')
	str = str.replace(/\(|'\(/g, '",["')
	str = str.replace(/\)/g, '"],"')
	str = str.replace(/\n/g, ' ')
	str = str.replace(/\s{2,}/g, ' ')
	str = str.replace(/,""|"",|," "/g, '')
	str = str.replace(/ "|" /g, '"')
	str = str.replace(/^",|,"$/g, '')
	str = str.replace(/^/, '[')
	str = str.replace(/$/, ']')

	let arr = JSON.parse(str)
	arr = arr[0]
	arr = tokenize(arr)

	return arr
}

function replaceLetStr(match, inner) {
	let bracketCount = 0
	let i

	for (i=0; i<inner.length; i++) {
		if (inner.charAt(i) === '[') {
			bracketCount++
		} else if (inner.charAt(i) === ']') {
			bracketCount--
		}
		if (bracketCount === -1) break
	}

	inner = inner.replace(inner.substring(0, i), (fullMatch) => {
		return '(()=>{ ' + fullMatch.replace(/\[(\w{1,30}), ([^\]]{1,500})\](,|)/g, (full, key, val) => {
			return `let ${key} = ${val};`
		})
	})
	inner = inner.replace(/\],/, '')

	return inner
}

let cpArgs = { numToParen: null, innerRegEx: null, replaceStr: null, outerRegEx: null, endChars: null }
function countParens() {
	let args = Array.prototype.slice.call(arguments)
	match = args[0]
	let fullString = match
	match = match.split('')

	let parCount = 0
	for (let i=cpArgs.numToParen; i<match.length; i++) {
		debugger;
		if (match[i] === '(') {
			parCount++
		} else if (match[i] === ')') {
			parCount--
		}
		if (parCount === 0) {
			match[i] = cpArgs.endChars
			break
		}
	}

	match = match.join('')
	match = match.replace(cpArgs.innerRegEx, cpArgs.replaceStr)
	match = match.replace(cpArgs.outerRegEx, countParens)

	return match
}

function compile(str) {
	writeJS(makeTree(str), false)
	result = result.replace(/, \)/g, ')')
	result = result.replace(/, \]/g, ']')
	result = result.replace(/, $/, '')

	cpArgs.numToParen = 10
	cpArgs.innerRegEx = /_schemeLet\(\[(.*)$/
	cpArgs.replaceStr = replaceLetStr
	cpArgs.endChars = '})()'
	cpArgs.outerRegEx = /_schemeLet.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	cpArgs.numToParen = 13
	cpArgs.innerRegEx = /_schemeLambda\(\[(.*?)\],/
	cpArgs.replaceStr = 'function ($1){'
	cpArgs.endChars = '}'
	cpArgs.outerRegEx = /_schemeLambda.*$/
	result = result.replace(cpArgs.outerRegEx, countParens)

	result = result.replace(/#t/g, 'true')
	result = result.replace(/#f/g, 'false')
}

compile(scheme)
console.log(result)

const fdx = fs.openSync('library.js', 'r')
let lib = fs.readFileSync(fdx, 'utf8')
let final = lib + result
fs.closeSync(fdx)

const fd = fs.openSync('src.js', 'w')
fs.writeFileSync(fd, final)
fs.closeSync(fd)

console.log(eval(final))
