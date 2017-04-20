const util = require('util')
const fs = require('fs')

const scheme = fs.readFileSync('src.scm', 'utf8')

let result = ''

function writeJS(array) {
	let isLitArr = false
	for (var i=0; i<array.length; i++) {
		if (Array.isArray(array[i])) {
			if (i === 0) {
				result += '['
				isLitArr = true
			}
			writeJS(array[i])
			if (i + 1 === array.length) {
				if (isLitArr) {
					result += '], '
				} else {
					result += '), '
				}
			}
		} else {
			switch (array[i]) {
				case '+':
					result += 'add('
					break
				case '-':
					result += 'subtract('
					break
				case '*':
					result += 'mult('
					break
				case '/':
					result += 'divide('
					break
				case '=':
					result += 'equals('
					break
				case 'eq?':
					result += 'equals('
					break
				case '>':
					result += 'greater('
					break
				case '<':
					result += 'less('
					break
				case '>=':
					result += 'greaterOrEqual('
					break
				case '<=':
					result += 'lessOrEqual('
					break			
				case 'null?':
					result += 'isNull('
					break
				case 'if':
					result += 'schemeIf('
					break
				case 'cond':
					result += 'cond('
					break
				case 'let':
					result += 'schemeLet('
					break
				default:
					if (i + 1 === array.length) {
						result += `${array[i]}`
						if (isLitArr) {
							result += '], '
						} else {
							result += '), '
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

function compile(str) {
	writeJS(makeTree(str))
	result = result.replace(/, \)/g, ')')
	result = result.replace(/, \]/g, ']')
	result = result.replace(/, $/, '')
	return result
}

console.log(util.inspect(makeTree(scheme), {depth: null}))

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



