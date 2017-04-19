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
		(if (= x 1) 1 
			(* x (fact (- x 1))))))`

let result = ''

function writeJS(array) {
	for (var i=0; i<array.length; i++){
		if (Array.isArray(array[i])) {
			writeJS(array[i])
			if (i + 1 === array.length) {
				result += '), '
			}
		} else {
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
					result += `${array[i+1]} === ${array[i+2]}`
					return result
				default:
					if (i + 1 === array.length) {
						result += `${array[i]}`
						result += '), '
					} else {
						result += `${array[i]}, `
					}
			}
		}
	}
	//return result.replace(/, /, '') + ')'
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

//console.log(util.inspect(tokenizer(len), {depth: null}))

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

console.log(eval(final))



