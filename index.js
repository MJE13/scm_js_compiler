const util = require('util')
const fs = require('fs')

const len = fs.readFileSync('list_length.scm', 'utf8')

let factorial = `(define fact 
	(lambda (x) 
		(if (= x 1) 1 
			(* x (fact (- x 1))))))`

const additionTest = '(+ 3 5 2)'

function writeJS(array) {
	result = ""
	array = array[0][0]
	for (var i=0; i<array.length; i++){
		if(array[i] === '+') {
			result += 'add('
		} else {
			result += `${array[i]}, `
		}
	}
	result += ')'
	result = result.replace(/, \)/, ')')
	return result
} 

function walk(arr){
	for(let i=0; i<arr.length; i++){
		if(Array.isArray(arr[i])){
			walk(arr[i])
		} else {
			arr[i] = arr[i].split(' ')
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
    
	return walk(JSON.parse(str))
}

console.log(util.inspect(tokenizer(factorial), {depth: null}))

let res = writeJS(tokenizer(additionTest))
console.log(res)

const fdx = fs.openSync('library.js', 'r')
let libSt = fs.readFileSync(fdx, 'utf8')
let final = libSt + res
console.log(eval(final))
fs.closeSync(fdx)

const fd = fs.openSync('output.js', 'w')
fs.writeFileSync(fd, final)
fs.closeSync(fd)



