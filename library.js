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

function schemeIf(bool, cbTrue, cbFalse) {
	if (bool) {
		return cbTrue
	} else {
		return cbFalse
	}
}

// END LIBRARY

