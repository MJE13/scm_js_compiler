function add() {
	return arguments.reduce((prev, next) => prev + next)
}

function subtract() {
	return arguments.reduce((prev, next) => prev - next)
}

function mult() {
	return arguments.reduce((prev, next) => prev * next)
}

function divide(x, y) {
	return x / y
}
