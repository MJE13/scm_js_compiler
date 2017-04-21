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

function schemeIf(bool, retTrue, retFalse) {
	if (bool) {
		return retTrue
	} else {
		return retFalse
	}
}

function cond() {
	let args = Array.prototype.slice.call(arguments)
	for (let i=0; i< args.length; i++) {
		if (args[i][0]) return args[i][1]
	}
}

function car(arr) {
	return arr[0]
}

// END LIBRARY

[1, [2, [3, [4, [5, [6, 7)]]]]]]