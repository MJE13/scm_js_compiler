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

// END LIBRARY

add(6, subtract(mult(5, 1), divide(10, 2)))