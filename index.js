const fs = require('fs')

const scheme = fs.readFileSync('src.scm', 'utf8')

let result = ''

function writeJS(array, funcOrArrContainer) {
	let isLitArr = false
	let isFuncArgs = false
	for (let i=0; i<array.length; i++) {
		if (Array.isArray(array[i])) {
			if (i === 0) {
				result += '['
				isLitArr = true
			}
			writeJS(array[i], isFuncArgs || isLitArr)
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
					result += '_scmjs_8tn7k2_add('
					isFuncArgs = true
					break
				case '-':
					result += '_scmjs_8tn7k2_subtract('
					isFuncArgs = true
					break
				case '*':
					result += '_scmjs_8tn7k2_mult('
					isFuncArgs = true
					break
				case '/':
					result += '_scmjs_8tn7k2_divide('
					isFuncArgs = true
					break
				case '=':
					result += '_scmjs_8tn7k2_equals('
					isFuncArgs = true
					break
				case 'eq?':
					result += '_scmjs_8tn7k2_equals('
					isFuncArgs = true
					break
				case '>':
					result += '_scmjs_8tn7k2_greater('
					isFuncArgs = true
					break
				case '<':
					result += '_scmjs_8tn7k2_less('
					isFuncArgs = true
					break
				case '>=':
					result += '_scmjs_8tn7k2_greaterOrEqual('
					isFuncArgs = true
					break
				case '<=':
					result += '_scmjs_8tn7k2_lessOrEqual('
					isFuncArgs = true
					break
				case 'null?':
					result += '_scmjs_8tn7k2_isNull('
					isFuncArgs = true
					break
				case 'if':
					result += '_scmjs_8tn7k2_if('
					isFuncArgs = true
					break
				case 'cond':
					result += '_scmjs_8tn7k2_cond('
					isFuncArgs = true
					break
				case 'else':
					result += '_scmjs_8tn7k2_else('
					isFuncArgs = true
					break
				case 'car':
					result += '_scmjs_8tn7k2_car('
					isFuncArgs = true
					break
				case 'cdr':
					result += '_scmjs_8tn7k2_cdr('
					isFuncArgs = true
					break
				case 'cons':
					result += '_scmjs_8tn7k2_cons('
					isFuncArgs = true
					break
				case 'let':
					result += '_scmjs_8tn7k2_let('
					break
				case 'and':
					result += '_scmjs_8tn7k2_and('
					isFuncArgs = true
					break
				case 'or':
					result += '_scmjs_8tn7k2_or('
					isFuncArgs = true
					break
				case 'set!':
					result += '_scmjs_8tn7k2_set('
					isFuncArgs = true
					break
				default:
					if (i === 0) {
						result += '['
						isLitArr = true
					}
					if (i + 1 === array.length) {
						result += `${array[i]}`
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
	str = '(let ((_scmjs_8tn7k2_globalScope 0)) ' + str + ')'
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
		return fullMatch.replace(/\[(\w{1,30}), ([^\]]{1,500})\](,|)/g, (full, key, val) => {
			return `let ${key} = ${val};`
		})
	})
	inner = inner.replace(/\],/, '')

	return inner
}

let cpArgs = { numToParen: null, innerRegEx: null, replaceStr: null, outerRegEx: null }
function countParens() {
	let args = Array.prototype.slice.call(arguments)
	match = args[0]
	match = match.split('')

	let parCount = 0
	for (let i=cpArgs.numToParen; i<match.length; i++) {
		if (match[i] === '(') {
			parCount++
		} else if (match[i] === ')') {
			parCount--
		}
		if (parCount === 0) {
			match.splice(i, 1)
			i--
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

	cpArgs.numToParen = 17
	cpArgs.innerRegEx = /_scmjs_8tn7k2_let\(\[(.*)$/
	cpArgs.replaceStr = replaceLetStr
	cpArgs.outerRegEx = /_scmjs_8tn7k2_let.*$/
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
