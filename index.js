const util = require('util')
const fs = require('fs')

const len = fs.readFileSync('list_length.scm', 'utf8')

function walk(arr){
	for(let i=0; i<arr.length; i++){
		if(Array.isArray(arr[i])){
			walk(arr[i])
		} else {
			arr[i] = arr[i].split(' ')
		}
	}
	return arr
}

function tokenizer(str){
	str = str.replace(/\(/g, '",["')
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

console.log(util.inspect(tokenizer(len), {depth: null}))



/*
const fact = `(define fact (lambda (x) (if (= x 1) 1 (* x (fact (- x 1))))))`
const member = `(define member? (lambda (a lat) (cond ((null? lat) #f) (else (or (eq? (car lat) a) (member? a (cdr lat)))))))`
*/
