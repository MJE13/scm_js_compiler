const util = require('util')
const fs = require('fs')

const len = fs.readFileSync('little_schemer_functions.scm', 'utf8')

const additionTest = '(+ 3 5 2)'
const subractionTest = '(- 2 3)'
const multTest = '(* -1 .5)'
const divTest = '(/ 3 2)'
const equalTest = '(= 1 9)'

const fact = `(define fact 
	(lambda (x) 
		(if (= x 1) 1 ( else (* x (fact (- x 1))))
		))`

let result = ''

function isElLit(s) {
	let isSL = true
	switch (s) {
		case '+':
			isSL = false
			break
		case '-':
			isSL = false
			break
		case '*':
			isSL = false
			break
		case '/':
			isSL = false
			break
		case '=':
			isSL = false
			break
		case 'eq?':
			isSL = false
			break
		case 'null?':
			isSL = false
			break
		default:
	}
	return isSL
}



function writeJS(array) {
	let inLitArr = false
	let inIf = false	
	for (var i=0; i<array.length; i++){
		if (Array.isArray(array[i]) && isElLit(array[i][0])) {
			result += '['
			inLitArr = true
		}
		if (array[i] === 'if') {
			result += 'schemeIf('
			inIf = true
			continue
		}
		if (Array.isArray(array[i])) {
			writeJS(array[i])
			if (i + 1 === array.length) {
				if (inLitArr) {
				console.log('LastLitEl', array[i])
				//result += `${array[i]}`
				result += '], '
				} else {
				result += '), '
				}
			} 
		} else {
			console.log('in switch', inLitArr)
			switch(array[i]){
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
				default:
					if (i + 1 === array.length) {
						//console.log("getting here", inLitArr)
						if (!inLitArr) {
							result += `${array[i]}`
							result += '), '
						} else {
							console.log('LastLitEl', array[i])
							result += `${array[i]}`
							result += '], '
							} 
					} else {
						result += `${array[i]}, `
					}
			}
		}
		if (inIf && i === 3) {
			result = result.replace(/\), $/, '')
			result += ')'
		}
	}
	return result
} 

function walk(arr){
	for(let i=0; i<arr.length; i++){
		if(Array.isArray(arr[i])){
			walk(arr[i])
			if (Array.isArray(arr[i][0]) && arr[i].length === 1) {
				arr[i] = arr[i][0]
			}
		} else {
			if (/ /.test(arr[i])) {
				let subArr = arr[i].split(' ')
				let lenSR = subArr.length
				arr[i] = subArr[0]
				for (let j=1; j<lenSR; j++) {
					arr.splice(i + j, 0, subArr[j])
				}
				i += lenSR - 1
			}
		}
	}
	return arr
}

function tokenizer(str){
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
	
    arr = walk(arr)

	return arr
}

console.log(util.inspect(tokenizer(len), {depth: null}))

let code = writeJS(tokenizer(len))
code = code.replace(/, \)/g, ')')
code = code.replace(/, $/, '')
console.log(code)

const fdx = fs.openSync('library.js', 'r')
let lib = fs.readFileSync(fdx, 'utf8')
let final = lib + code
fs.closeSync(fdx)

const fd = fs.openSync('output.js', 'w')
fs.writeFileSync(fd, final)
fs.closeSync(fd)

//console.log(eval(final))



