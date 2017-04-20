const util = require('util')
const fs = require('fs')

const scheme = fs.readFileSync('src.scm', 'utf8')

let result = ''
let depth = 0

function writeJS(array, funcOrArrContainer) {
	depth++
	
	let isLitArr = false
	let isFuncArgs = false
	for (var i=0; i<array.length; i++) {
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
					result += 'add('
					isFuncArgs = true
					break
				case '-':
					result += 'subtract('
					isFuncArgs = true
					break
				case '*':
					result += 'mult('
					isFuncArgs = true
					break
				case '/':
					result += 'divide('
					isFuncArgs = true
					break
				case '=':
					result += 'equals('
					isFuncArgs = true
					break
				case 'eq?':
					result += 'equals('
					isFuncArgs = true
					break
				case '>':
					result += 'greater('
					isFuncArgs = true
					break
				case '<':
					result += 'less('
					isFuncArgs = true
					break
				case '>=':
					result += 'greaterOrEqual('
					isFuncArgs = true
					break
				case '<=':
					result += 'lessOrEqual('
					isFuncArgs = true
					break			
				case 'null?':
					result += 'isNull('
					isFuncArgs = true
					break
				case 'if':
					result += 'schemeIf('
					isFuncArgs = true
					break
				case 'cond':
					result += 'cond('
					isFuncArgs = true
					break
				case 'car':
					result += 'car('
					isFuncArgs = true
					break
				case 'let':
					result += 'schemeLet('
					break
				default:
					if (i + 1 === array.length) {
						console.log('inside default', array[i], isFuncArgs, depth)
						result += `${array[i]}`
						if (isLitArr) {
							result += '], '
						} else if (funcOrArrContainer) {
							console.log('inside default', array[i], isFuncArgs, depth)
							result += '), '
						} else {
							result += '); '
						}
					} else if (i === 0) {
						result += `[${array[i]}, `
						isLitArr = true
					} else {
						result += `${array[i]}, `
					}
			}
		}
	}
	
	depth--
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
	str = str.replace(/".*"/g, match => match.replace(/ /g, '#$%'))
	str = str.replace(/"/g, "@&@")
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
    if (Array.isArray(arr[0]) && arr.length === 1) {
		arr = arr[0]
	}
	
    arr = tokenize(arr)

	return arr
}

function countParens(match) {
	match = match.split('')

	let parCount = 0
	for (let i=9; i<match.length; i++) {
		
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
	match = match.replace(/schemeLet\(\[\[(.), (.)\]\],/, ' let $1 = $2; ')
	match = match.replace(/schemeLet.*$/, countParens)
	
	return match
}

function compile(str) {
	writeJS(makeTree(str), false)
	result = result.replace(/, \)/g, ')')
	result = result.replace(/, \]/g, ']')
	result = result.replace(/, $/, '')
	result = result.replace(/schemeLet.*$/, countParens)
	return result
}

//console.log(util.inspect(makeTree(scheme), {depth: null}))

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



