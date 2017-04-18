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

function buildWalk(arr){
	for(let i=0; i<arr.length; i++){
		if(Array.isArray(arr[i])){
			buildWalk(arr[i])
		} else {
			finalOutput += writeJS(arr[i])
		}
	}
}

function writeJS(array) {
	console.log("input array", array[2])
	if (Array.isArray(array[0][0])) {
		array = array[0][0]
	} else {
		array = array[0]
	}
	console.log("THIS IS THE ARRAY", array)
	for (var i=0; i<array.length; i++){
		console.log("found array", array[i])
		if (Array.isArray(array[i])) {
			writeJS(array[i])
		}
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
				result += `${array[i]}, `
				break
		}
	}
	result += ')'
	result = result.replace(/, \)/, ')')
	return result
} 

function walk(arr){
	for(let i=0; i<arr.length; i++){
		console.log("walk", arr[i])
		if(Array.isArray(arr[i])){
			walk(arr[i])
		} else {
			let insideArr = arr[i].split(' ')
			
			for (let j=0; j<arr[i].length; j++){
				if (!Number.isNaN(parseFloat(arr[i][j]))){
					arr[i][j] = parseFloat(arr[i][j])
				}
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
    console.log("parsed string", util.inspect(JSON.parse(str), {depth: null}))
	return walk(JSON.parse(str))
}

//console.log(util.inspect(tokenizer(len), {depth: null}))

//console.log(tokenizer(len))
console.log(tokenizer(len))
//console.log(result)

/*let res = writeJS(tokenizer(multTest))
console.log(res)

const fdx = fs.openSync('library.js', 'r')
let libSt = fs.readFileSync(fdx, 'utf8')
let final = libSt + res
console.log(eval(final))
fs.closeSync(fdx)

const fd = fs.openSync('output.js', 'w')
fs.writeFileSync(fd, final)
fs.closeSync(fd)*/



