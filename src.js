function add() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev + next)
}

function subtract() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev - next)
}

function mult() {
	return Array.prototype.slice.call(arguments).reduce((prev, next) => prev * next)
}

function divide(x, y) {
	return x / y
}

function equals(x, y) {
	return x === y
}

function greater(x, y) {
	return x > y
}

function less(x, y) {
	return x < y
}

function greaterOrEqual(x, y) {
	return x >= y
}

function lessOrEqual(x, y) {
	return x <= y
}

function isNull(x) {
	return x === null
}

function schemeIf(bool, exp1, exp2) {
	if (bool) {
		return exp1
	} else {
		return exp2
	}
}

function cond() {
	let args = Array.prototype.slice.call(arguments)
	for (let i=0; i< args.length; i++) {
		if (args[i] === true) return args[i+1]
		if (args[i] === false) {
			i++
			continue
		}
		if (args[i].length === 1) return args[i][0]
		if (args[i][0]) return args[i][1]
	}
}

function condElse(arg) {
	return [true, arg]
}

function car(arr) {
	return arr[0]
}

function cdr(arr) {
	arr.shift()
	return arr
}

function cons(add, list) {
	list.unshift(add)
	return list
}

function schemeAnd(){
	let args = Array.prototype.slice.call(arguments)
	if (args.length === 0) return true
	if (args.length === 1) return args[0]
	if (args[0] !== false && args[1] !== false) return args[1]
	return false
}

// END LIBRARY
schemeAnd(1, [a, b]); 